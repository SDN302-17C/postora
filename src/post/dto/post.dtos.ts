import { IsNotEmpty } from "class-validator";

export class createPostDto {
    @IsNotEmpty()
    title: string;
    
    content: string;
    summary: string;
    status: number;
}