import React from 'react';
import Container from './Container';
import Weatherdetails, { WeatherdetailsProps } from './WeatherDetail';
import { Convertkalvintocelcius } from '../utils/Convertkalvintocelcius';

export interface ForecastWeatherDetailProps extends WeatherdetailsProps {
  WeatherIcon: string;
  date: string;
  day: string;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  descrption: string;
}

export default function ForecastWeatherDetail({
  WeatherIcon,
  date = "19.09",
  day = "Tuesday",
  temp = 273.15, // Default to 0°C
  feels_like = 273.15,
  temp_min = 273.15,
  temp_max = 273.15,
  descrption,
  ...weatherDetailsProps
}: ForecastWeatherDetailProps) {
  return (
    <Container className='gap-4 border-none'>
      {/* Left Section */}
      <section className='flex gap-4 items-center px-4'>
        <div className='flex flex-col gap-1 items-center'>
          <img src={`https://openweathermap.org/img/wn/${WeatherIcon}.png`} alt="Weather Icon" />
          <p>{date}</p>
          <p className='text-sm'>{day}</p>
        </div>
        {/* Temperature & Description */}
        <div className='flex flex-col px-4'>
          <span className='text-5xl'>{Convertkalvintocelcius(temp)}°</span>
          <p className='text-xs space-x-1 whitespace-nowrap'>
            <span>Feels Like</span>
            <span>{Convertkalvintocelcius(feels_like)}°</span>
          </p>
          <p className='capitalize'>{descrption}</p>
        </div>
      </section>
      {/* Right Section */}
      <section className='overflow-x-auto flex justify-between gap-4 w-full pr-10'>
        <Weatherdetails {...weatherDetailsProps} />
      </section>
    </Container>
  );
}
