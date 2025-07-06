import type { IResponseDeserializer } from '@spotify/web-api-ts-sdk';

export class CustomResponseDeserializer implements IResponseDeserializer {
  public async deserialize<TReturnType>(
    response: Response
  ): Promise<TReturnType> {
    const text = await response.text();

    try {
      if (text.length > 0) {
        const json = JSON.parse(text);
        return json as TReturnType;
      }

      return null as TReturnType;
    } catch {
      return null as TReturnType;
    }
  }
}
