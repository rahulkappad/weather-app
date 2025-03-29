import React from 'react'
import { LuEye } from "react-icons/lu";
import { FiDroplet } from "react-icons/fi";
import { MdAir } from "react-icons/md";
import { ImMeter } from "react-icons/im";
import { LuSunrise } from "react-icons/lu";
import { LuSunset } from "react-icons/lu";


export interface WeatherdetailsProps {
    Visability: String;
    Humidity: String;
    WindSpeed: String;
    AirPressure: String;
    SunRise: String;
    SunSet: String;
}

export default function Weatherdetails( props :WeatherdetailsProps) {
    const{
        Visability="25km",
        Humidity="60%",
        WindSpeed="6 km/h",
        AirPressure="1003 hPa",
        SunRise="6.30",
        SunSet="10.33"
    } = props;

  return <>
  <SingleWeatherDetail
  icon={<LuEye/>}
  information="Visability"
  value={props.Visability}
  />
  <SingleWeatherDetail
  icon={<FiDroplet />}
  information="Humidity"
  value={props.Humidity}
  />
  <SingleWeatherDetail
  icon={<MdAir />}
  information="WindSpeed"
  value={props.WindSpeed}
  />
  <SingleWeatherDetail
  icon={<ImMeter />}
  information="AirPressure"
  value={props.AirPressure}
  />
  <SingleWeatherDetail
  icon={<LuSunrise />}
  information="SunRise"
  value={props.SunRise}
  />
  <SingleWeatherDetail
  icon={<LuSunset />}
  information="SunSet"
  value={props.SunSet}
  />
  </>;
}

export interface SingleWeatherDetailProps {
    information: String;
    icon: React.ReactNode;
    value: String;
}

function SingleWeatherDetail (props : SingleWeatherDetailProps) {
    return(
        <div className='flex flex-col justify-between gap-2 items-center text-xs font-semibold text-black/80'>
        <p className='whitespace-nowrap'>{props.information}</p>
        <div className='text-3xl'>{props.icon}</div>
        <p>{props.value}</p>
        </div>
    )
};