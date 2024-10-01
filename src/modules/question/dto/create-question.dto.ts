import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateQuestionDto {
    @ApiProperty({
        example: 'What is the capital of Indonesia?',
        description: 'The title of the question',
        required: true,
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        description: 'The content of the question',
        required: true,
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    content: string;
}
