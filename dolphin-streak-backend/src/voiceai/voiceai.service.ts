import { BadGatewayException, Injectable } from '@nestjs/common';
import { CreateVoiceaiDto } from './dto/create-voiceai.dto';
import { UpdateVoiceaiDto } from './dto/update-voiceai.dto';
import { SpeechClient } from '@google-cloud/speech';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class VoiceaiService {
  private readonly googleCredentials: string;
  private readonly speechClient: SpeechClient;

  constructor(private readonly configService: ConfigService) {
    // Load the Google credentials path from environment variables
    this.googleCredentials = this.configService.get<string>('GOOGLE_APPLICATION_CREDENTIALS_JSON');
   
    // Initialize the Speech-to-Text client with the credentials
    this.speechClient = new SpeechClient({ keyFilename: this.googleCredentials });
    console.log('Google Speech-to-Text client initialized!');
  }

  /**
   * Recognize speech from the provided audio file.
   * @param {string} audioFilePath - Path to the audio file for speech-to-text conversion.
   * @returns {Promise<any>} Transcription result.
   */
  async recognizeSpeech(audioFilePath: string): Promise<any> {
    try {
      const audio = {
        uri: audioFilePath,
      };

      // Configure the request for the Speech-to-Text API
      const request = {
        audio: audio,
        config: {
          encoding: 'LINEAR16',
          sampleRateHertz: 16000,
          languageCode: 'en-US',
        },
      };

      // Call the API to detect speech
      const response = await this.speechClient.recognize(request);

      // Extract transcription from the API response
      // const transcription = response.results
      //   .map((result) => result.alternatives[0].transcript)
      //   .join('\n');

      return {
        modelName: 'Google Speech-to-Text',
        response,
      };
    } catch (error) {
      throw new BadGatewayException(`Failed to fetch data from Google Speech-to-Text: ${error.message}`);
    }
  }
}
