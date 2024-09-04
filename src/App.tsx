import { useRef, useState, useEffect } from 'react'
import Gif from './assets/4.gif'
import Egg from './assets/egg.png'
import Music from './assets/music.ogg'

function App() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    if (!isPlaying || !audioRef.current) {
      return
    }

    const audioContext = new AudioContext()
    const source = audioContext.createMediaElementSource(audioRef.current)
    const analyser = audioContext.createAnalyser()
    source.connect(analyser)
    analyser.connect(audioContext.destination)

    analyser.fftSize = 256
    const dataArray = new Uint8Array(analyser.frequencyBinCount)

    const animate = () => {
      analyser.getByteFrequencyData(dataArray)
      const lowEnd = dataArray.slice(0, 10).reduce((acc, val) => acc + val, 0) / 10
      const highEnd = dataArray.slice(-10).reduce((acc, val) => acc + val, 0) / 10

      setScale(1 + lowEnd / 640) // Simplified scaling factor
      setRotation(highEnd / 4)
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      audioContext.close()
    }
  }, [isPlaying])

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {isPlaying && (
        <div className="absolute inset-0 animate-float">
          <div
            className="absolute inset-0 bg-repeat [image-rendering:pixelated]"
            style={{
              backgroundImage: `url(${Gif})`,
              backgroundSize: '100px 100px',
              width: '200%',
              height: '200%',
            }}
          />
        </div>
      )}
      <div className="z-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <button
          type="button"
          onClick={() => {
            audioRef.current?.play()
            setIsPlaying(true)
          }}
          aria-label="Play"
          className="relative size-48 sm:size-96 bg-contain bg-no-repeat hover:animate-jiggle disabled:animate-none focus-visible:animate-jiggle outline-none group [image-rendering:pixelated]"
          style={{
            backgroundImage: `url(${Egg})`,
            transform: isPlaying ? `scale(${scale}) rotate(${rotation}deg)` : undefined,
            transition: 'transform 0.1s ease-out',
          }}
          disabled={isPlaying}
        >
          {!isPlaying && (
            <div
              className="absolute inset-0 bg-contain bg-no-repeat opacity-0 group-hover:opacity-70 group-focus-visible:opacity-70 transition-opacity duration-300"
              style={{
                backgroundImage: `url(${Egg})`,
                filter: 'blur(15px) brightness(150%)',
                transform: 'scale(1.0)',
              }}
            />
          )}
        </button>
        <p className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap bottom-[-2rem] text-white text-center select-none opacity-0 animate-[fadeIn_1s_ease-in_5s_forwards] group-hover:animate-none group-hover:opacity-0">
          Click Eggtilda
        </p>
      </div>
      {/* biome-ignore lint/a11y/useMediaCaption: There is none */}
      <audio loop ref={audioRef}>
        <source src={Music} type="audio/ogg" />
      </audio>
    </div>
  )
}

export default App
