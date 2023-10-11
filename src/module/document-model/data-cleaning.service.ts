import { Injectable } from '@nestjs/common';

@Injectable()
export class DataCleaningService {
  handleLineBreaksAndWhitespace(inputString: string) {
    // Remove leading and trailing whitespace
    let cleanedString = inputString.trim();

    // Replace multiple spaces and line breaks with a single space
    cleanedString = cleanedString.replace(/\s+/g, ' ');

    return cleanedString;
  }

  removeNonAlphanumeric(inputString: string) {
    // Use a regular expression to replace all non-alphanumeric characters with an empty string
    return inputString.replace(/[^a-zA-Z0-9]/g, '');
  }

  replaceLineBreaks(inputString: string) {
    // Replace line breaks and white spaces with semicolons
    return inputString.replace(/\s+/g, ';');
  }
}
