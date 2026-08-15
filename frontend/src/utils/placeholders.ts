export interface DummyImageParams {
  width: number;
  height?: number;
  text?: string;
}

export function makeDummyImageUrl(params: DummyImageParams): string {
  const height = params.height ?? (params.width * 5) / 4;
  const res = `https://dummyimage.com/${params.width}x${height}/333/`;
  return params.text ? `${res}&text=${params.text}` : res;
}
