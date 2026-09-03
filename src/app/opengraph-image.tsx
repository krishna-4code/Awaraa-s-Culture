import { ImageResponse } from 'next/og';
import { BRAND_NAME } from '@/lib/constants';
 
export const alt = BRAND_NAME;
export const size = {
  width: 1200,
  height: 630,
};
 
export const contentType = 'image/png';
 
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#1F1C18', // charcoal
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#D8CFB5', // dust
        }}
      >
        <div
          style={{
            fontSize: 88,
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: '#FFFFFF',
          }}
        >
          {BRAND_NAME}
        </div>
        <div
          style={{
            fontSize: 32,
            fontFamily: 'sans-serif',
            marginTop: 32,
            color: '#FF5E1E', // bright amber
            letterSpacing: '0.05em',
            fontWeight: 600,
          }}
        >
          {BRAND_NAME}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
