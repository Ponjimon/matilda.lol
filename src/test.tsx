import { useRef, useState, useEffect } from 'react'
import Gif from './assets/4.gif'
import Egg from './assets/egg.png'
import Music from './assets/music.ogg'
import { cn } from './utils'

function App() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioContextRef.current = new AudioContext()
      const source = audioContextRef.current.createMediaElementSource(audioRef.current)
      const analyser = audioContextRef.current.createAnalyser()
      source.connect(analyser)
      analyser.connect(audioContextRef.current.destination)

      analyser.fftSize = 256
      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      const animate = () => {
        analyser.getByteFrequencyData(dataArray)
        const lowEnd = dataArray.slice(0, 10).reduce((acc, val) => acc + val, 0) / 10
        const highEnd = dataArray.slice(-10).reduce((acc, val) => acc + val, 0) / 10

        const newScale = 1 + lowEnd / (128 * 5) // Increased scaling factor
        const newRotation = highEnd / 4 // Rotation based on high frequencies

        setScale(newScale)
        setRotation(newRotation)
        requestAnimationFrame(animate)
      }
      animate()
    }
  }, [isPlaying])

  useEffect(() => {
    if (!isPlaying) {
      const timer = setTimeout(() => {
        setShowHint(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [isPlaying])

  return (
    <div className={cn('relative w-screen h-screen overflow-hidden bg-black')}>
      {isPlaying && (
        <div className="absolute inset-0 animate-float">
          <div
            className="absolute inset-0 bg-repeat"
            style={{
              backgroundImage: `url(${Gif})`,
              backgroundSize: '100px 100px', // Adjust size as needed
              width: '200%',
              height: '200%',
            }}
          />
        </div>
      )}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <button
          type="button"
          onClick={() => {
            audioRef.current?.play()
            setIsPlaying(true)
          }}
          aria-label="Play"
          className="relative size-48 sm:size-96 bg-contain bg-no-repeat hover:animate-jiggle disabled:animate-none focus-visible:animate-jiggle outline-none group"
          style={{
            backgroundImage: `url(${Egg})`,
            transform: `scale(${scale}) rotate(${rotation}deg)`,
            transition: 'transform 0.1s ease-out',
          }}
          disabled={isPlaying}
        />
        {showHint && !isPlaying && (
          <p className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap bottom-[-2rem] text-white/15 text-center select-none">
            Click the egg to start
          </p>
        )}
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div
          className="size-48 sm:size-96 bg-contain bg-no-repeat"
          style={{
            backgroundImage: `url(${Egg})`,
            filter: 'blur(15px) brightness(150%)',
            transform: 'scale(2.1)',
          }}
        />
      </div>
      {/* biome-ignore lint/a11y/useMediaCaption: There is none */}
      <audio loop ref={audioRef}>
        <source src={Music} type="audio/ogg" />
      </audio>
    </div>
  )
}

export default App
