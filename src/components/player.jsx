import { usePlayerStore } from "@/store/playerstore";
import { useEffect, useRef, useState } from "react";
import { Slider } from "./Slider"




export const Pause = ({className}) => (
    <svg className={className} role="img" height="12" width="12" aria-hidden="true" viewBox="0 0 16 16"><path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"></path></svg>
  )
  
export const Play = ({className}) => (
    <svg className={className} role="img" height="12" width="12" aria-hidden="true" viewBox="0 0 16 16"><path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path></svg>
  )

export const VolumeSilence = () => (
    <svg fill="currentColor" role="presentation" height="16" width="16" aria-hidden="true" aria-label="Volumen apagado" viewBox="0 0 16 16" ><path d="M13.86 5.47a.75.75 0 0 0-1.061 0l-1.47 1.47-1.47-1.47A.75.75 0 0 0 8.8 6.53L10.269 8l-1.47 1.47a.75.75 0 1 0 1.06 1.06l1.47-1.47 1.47 1.47a.75.75 0 0 0 1.06-1.06L12.39 8l1.47-1.47a.75.75 0 0 0 0-1.06z"></path><path d="M10.116 1.5A.75.75 0 0 0 8.991.85l-6.925 4a3.642 3.642 0 0 0-1.33 4.967 3.639 3.639 0 0 0 1.33 1.332l6.925 4a.75.75 0 0 0 1.125-.649v-1.906a4.73 4.73 0 0 1-1.5-.694v1.3L2.817 9.852a2.141 2.141 0 0 1-.781-2.92c.187-.324.456-.594.78-.782l5.8-3.35v1.3c.45-.313.956-.55 1.5-.694V1.5z"></path></svg>
  )   

export const Volume = () => (
    <svg fill="currentColor" role="presentation" height="16" width="16" aria-hidden="true" aria-label="Volumen alto" id="volume-icon" viewBox="0 0 16 16"><path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z"></path><path d="M11.5 13.614a5.752 5.752 0 0 0 0-11.228v1.55a4.252 4.252 0 0 1 0 8.127v1.55z"></path></svg>
    )  



const CurrentSong = ({image, title, artists}) => {
    console.log('CurrentSong props:', {image, title, artists})
    
    return(
        <div className={`
        flex items-center gap-5 relative 
        overflow-hidden 
        `}
        >
            <picture className="w-12 h-12 bg-zinc-800 rounded-md shadow-lg overflow-hidden">
                {image && <img src={image} alt={title} className="w-full h-full object-cover" />}
            </picture>

        <div className="flex flex-col ">
            <h3 className="font-semibold text-sm block ">
            {title}
            </h3> 
            <span className="text-xs opacity-80">
            <p>
                {artists?.join(", ")}
            </p>
            </span>
            
        </div>
        </div>
    )
}  


const SongControl=({audio})=>{
    
    const [currentTime, setCurrentTime]=useState(0)

    useEffect(()=>{
        audio.current.addEventListener("timeupdate", handleTimeUpdate)
        return()=>{
            audio.current.removeEventListener("timeupdate", handleTimeUpdate)
        }
    },[])

    const handleTimeUpdate=()=>{
        setCurrentTime(audio.current.currentTime)
    }

    const formaTime=time=>{
        if(time==0) return `0:00`

        const seconds= Math.floor(time % 60)
        const minutes=Math.floor(time/60)
        return `${minutes}:${seconds.toString().padStart(2, "0")}`
        
    }

    const duration=audio?.current?.duration??0

    return(
        <div className="flex gap-x-3 text-xs ">
            <span className="opacity-50 ">{formaTime(currentTime)}</span>
            <Slider 
                
                max={audio?.current?.duration ?? 0}
                min={0}
                className="w-[400px]"
                value={[currentTime]}
                onValueChange={(value)=>{
                    const [newCurrenTime]=value
                    audio.current.currentTime=newCurrenTime
                   
                }}
                />
            <span className="opacity-50 ">{duration?formaTime(duration):null}</span>
        </div>
    )
}


const VolumenControl=()=>{
    
    const volume=usePlayerStore(state=>state.volume)
    const setVolume=usePlayerStore(state=>state.setVolume)
    const previousVolumeRef = useRef(volume)

    const isVolumeSilenced = volume<0.1

    const handleClickVolume=()=>{
        if(isVolumeSilenced){
            setVolume(previousVolumeRef.current)
        }else{
            previousVolumeRef.current=volume
        setVolume(0)
        }

    }


    return(
        <div className="flex  justify-center gap-x-4  text-white mt-4">
            <button className="opacity-70 hover:opacity-100 transition " onClick={handleClickVolume}>
            {isVolumeSilenced ? <VolumeSilence/> : <Volume/>}
            </button>
        <Slider defaultValue={[100]}
                max={100}
                min={0}
                className="w-[95px]"
                value={[volume*100]}
                onValueChange={(value)=>{
                    const[newVolume]=value
                    const volumeValue=newVolume/100
                    setVolume(volumeValue)
                }}
                />
        </div>
    )
}

  export function Player () {
    const {currentMusic,isPlaying, setIsPlaying, volume} = usePlayerStore(state=>state)
    const audioRef=useRef()
    
    // Debug current music state
    useEffect(() => {
        console.log('Current music state:', currentMusic)
    }, [currentMusic])

    useEffect(()=>{
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play()
                .catch(error => {
                    console.error('Error playing audio in isPlaying effect:', error)
                    setIsPlaying(false)
                })
            } else {
                audioRef.current.pause()
            }
        }
    },[isPlaying])

    useEffect(()=>{
        audioRef.current.volume=volume
    },[volume])

   useEffect(()=>{
    const {song, playlist,songs}=currentMusic
    if(song){
        const src = `/music/${playlist?.id}/${song.id.toString().padStart(2, '0')}.mp3`
        console.log('Loading audio from:', src)
        audioRef.current.src=src
        audioRef.current.volume=volume
        if (isPlaying) {
            audioRef.current.play()
            .catch(error => {
                console.error('Error playing audio:', error)
                setIsPlaying(false)
            })
        }
    }
   },[currentMusic])

    const handleClick = () =>{
        
    setIsPlaying(!isPlaying)
}
    return(
        <div className="flex flex-row justify-between w-full px-2 z-50">
            <div className="w-[180px]">
            {currentMusic.song && <CurrentSong {...currentMusic.song}/>}
        </div>

            <div className=" grid place-contend-center gap-4 flex-1 ">
                <div className="flex justify-center flex-col items-center ">
                <button className="bg-white  rounded-full mt-2 p-2 mb-6" onClick={handleClick}>
                    {isPlaying ? <Pause/> : <Play/>}
                </button>
                <SongControl audio={audioRef}/>
                <audio ref={audioRef}/>
                </div>

            </div>


            <div className="grid place-contend-center mb-6 ">
            <VolumenControl/>
            </div>

            
        </div>
    )
}

export default Player;







