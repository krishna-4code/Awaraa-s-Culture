import { ImageResponse } from 'next/og';
 
export const runtime = 'edge';
 
export const alt = 'Awaraa\'s Culture - Engineered Exclusivity';
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
            fontSize: 96,
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          Awaraa's Culture
        </div>
        <div
          style={{
            fontSize: 32,
            fontFamily: 'sans-serif',
            marginTop: 40,
            opacity: 0.8,
            letterSpacing: '0.05em',
          }}
        >
          Engineered Exclusivity
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
