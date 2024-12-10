import { BadGatewayException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { SpeechClient } from '@google-cloud/speech';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class VoiceaiService {
  private readonly googleCredentials: string;
  private readonly speechClient: SpeechClient;
  private readonly storage: Storage;
  private readonly bucketName: string;
  private readonly convertioApiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.googleCredentials = this.configService.get<string>('GOOGLE_APPLICATION_CREDENTIALS_JSON');
    this.bucketName = this.configService.get<string>('GCP_BUCKET_NAME');
    this.convertioApiKey = this.configService.get<string>('CONVERTIO_API_KEY');
    this.speechClient = new SpeechClient({ keyFilename: this.googleCredentials });
    this.storage = new Storage({ keyFilename: this.googleCredentials });
  }

  /**
   * Convert an audio file to WAV format using Convertio API.
   * @param fileBuffer Buffer of the uploaded audio file.
   * @param inputFormat The format of the uploaded file (e.g., 'mp3', 'm4a').
   * @returns {Promise<Buffer>} The converted WAV file as a buffer.
   */
  private async convertToWavWithConvertio(fileBuffer: Buffer, inputFormat: string): Promise<Buffer> {
    const apiUrl = 'https://api.convertio.co/convert';
    const fileIdResponse = await axios.post(
      `${apiUrl}`,
      {
        apikey: this.convertioApiKey,
        input: 'base64',
        file: fileBuffer.toString('base64'),
        filename: `input.${inputFormat}`,
        outputformat: 'wav',
      },
    );
    const fileId = fileIdResponse.data.data.id;

    let conversionResult: any;
    while (true) {
      const statusResponse = await axios.get(`${apiUrl}/${fileId}/status`);
      console.log(statusResponse.data);
      
      if (statusResponse.data.data.step === 'finish') {
        conversionResult = statusResponse.data.data;
        break;
      } 
      else if (statusResponse.data.data.step === 'convert') {
        console.log("still converting");
      } 
      else if (statusResponse.data.status === 'error') {
        throw new Error(`Convertio API error: ${statusResponse.data.error}`);
      }
      
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds
    }

    const fileResponse = await axios.get(conversionResult.output.url, {
      responseType: 'arraybuffer',
    });

    return Buffer.from(fileResponse.data);
  }

  /**
   * Upload file to Google Cloud Storage
   * @param fileBuffer Buffer of the file to upload.
   * @param fileName Destination name in the bucket.
   * @returns {Promise<string>} URL of the uploaded file.
   */
  private async uploadToBucket(fileBuffer: Buffer, fileName: string): Promise<string> {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(fileName);
    await file.save(fileBuffer);
    await file.makePublic(); // Make the file publicly accessible
    // console.log(`gs://${this.bucketName}/${fileName}`);
    return `gs://${this.bucketName}/${fileName}`;
  }

  /**
   * Decode wav to get sample rate
   * @param buffer buffer of the file to upload.
   * @returns {Promise<number>} the number of the sample rate.
   */
  private async getSampleRate(buffer: Buffer): Promise<number> {
    const wav = require('node-wav');
    const result = wav.decode(buffer);
    return result.sampleRate;
  }
  
  /**
   * Delete a file from Google Cloud Storage
   * @param filePath Path of the file in the bucket
   */
  private async deleteFromBucket(filePath: string): Promise<void> {
    await this.storage.bucket(this.bucketName).file(filePath).delete();
  }

  /**
   * Recognize speech from an uploaded audio file.
   * @param fileBuffer Buffer of the uploaded audio file.
   * @param inputFormat The format of the uploaded file (e.g., 'mp3', 'm4a').
   * @returns {Promise<any>} Transcription result.
   */
  async recognizeSpeech(fileBuffer: Buffer, inputFormat: string): Promise<any> {
    const bucketFileName = `${uuidv4()}.wav`;

    try {
      const wavBuffer = await this.convertToWavWithConvertio(fileBuffer, inputFormat);
      
      const uri = await this.uploadToBucket(wavBuffer, bucketFileName);

      const sampleRate = await this.getSampleRate(wavBuffer);

      const audio = { uri: uri };
      const request = {
        audio: audio,
        config: {
          encoding: 'LINEAR16',
          sampleRateHertz: sampleRate,
          languageCode: 'en-US',
          audioChannelCount: 2,
          enableSeparateRecognitionPerChannel: true
        },
      };

      const response = await this.speechClient.recognize(request);
      const results = response[0].results.map((result) => { 
        return result.alternatives[0]
       })

      let confidence = 0;
      let transcript = "";

      for (const result of results) {
        if(result.confidence > confidence){
          confidence = result.confidence;
          transcript = result.transcript
        }
      }

      return {
        transcript,
        confidence
      };
    } catch (error) {
      console.log(error.response.data.error);
      if(error.status == 422){
        throw new UnprocessableEntityException(`${error.response.data.error}. Wait for tomorrow for new convertion minutes`);
      }
      else{
        throw new BadGatewayException(`Failed to process audio: ${error.message}`);
      }
    } finally {
      await this.deleteFromBucket(bucketFileName).catch(() => {});
    }
  }
}
