import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class PromptDto {
    // @ApiProperty({
    //     description: "the prompt that is going to be send to gemini API",
    //     example: "Give me a list of dog breed"
    // })
    // @IsString()
    // prompt: String;

    @ApiProperty({
        description: "The theme that is becoming the topic of the essay",
        example: "family"
    })
    @IsString()
    theme: String;

    @ApiProperty({
        description: "The essay is the answer given by the user based on the theme provided by admin",
        example: `
            Family is the foundation of our lives, providing love, support, and a sense of belonging. 
            It serves as the first social structure where we learn values, morals, and interpersonal skills. 
            Families come in various forms, from traditional nuclear setups to extended families or chosen families, 
            but their significance remains universal.  

            A loving family nurtures its members, fostering emotional well-being and personal growth. 
            It offers a safe space where individuals can express themselves without fear of judgment. 
            In challenging times, family members rally together, offering strength and guidance. 
            This support system builds resilience and teaches us the importance of compassion and unity.  

            Moreover, family traditions and shared experiences create lasting memories and a sense of identity. 
            Celebrations, holidays, and even mundane routines reinforce bonds, shaping who we are. 
            These moments remind us of the joy of connection and the importance of cherishing time spent together.  

            While no family is perfect, effort and communication are key to overcoming conflicts and strengthening relationships. 
            Mutual respect and understanding allow families to grow together, adapting to life’s changes.  

            Ultimately, family is more than a group of people; it is a lifelong source of love and stability, 
            reminding us that we are never truly alone.
            `
    })
    @IsString()
    essay: String;
}
