'use client'

import Image from "next/image";
import Navbar from "./components/Navbar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { parseISO } from "date-fns/fp";
import Container from "./components/Container";
import { Convertkalvintocelcius } from "./utils/Convertkalvintocelcius";


type WeatherData = {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherEntry[];
  city: City;
};

type WeatherEntry = {
  dt: number;
  main: MainWeather;
  weather: Weather[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number;
  sys: Sys;
  dt_txt: string;
};

type MainWeather = {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
};

type Weather = {
  id: number;
  main: string;
  description: string;
  icon: string;
};

type Clouds = {
  all: number;
};

type Wind = {
  speed: number;
  deg: number;
  gust: number;
};

type Sys = {
  pod: string;
};

type City = {
  id: number;
  name: string;
  coord: Coordinates;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
};

type Coordinates = {
  lat: number;
  lon: number;
};

export default function Home() {

  const { isPending, error, data } = useQuery<WeatherData>({
    queryKey: ['repoData'],
    queryFn: async ()=>
    {
      const {data} = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=canada&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`)
      return data;
    }
  })

  const firstData = data?.list[0];

  console.log('data',data)

  if (isPending) return <div className="flex items-center min-h-screen justify-center">
    <p className="animate-bounce">Loading...</p>
  </div>
  
  return (
   <div className="flext flex-col gap-2 bg-gray-100 min-h-screen">
    <Navbar/>
    <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
      {/* Today data */}
      <section>
        <div>
          <h2 className="flex gap-1 text-2xl items-end">
          <p className="text-2xl">{format(parseISO(firstData?.dt_txt ?? ''),'EEEE')}</p>
          <p className="text-lg">({format(parseISO(firstData?.dt_txt ?? ''),'dd.MM.yyyy')})</p>
          </h2>
          <Container className="gap-10 px-6 items-center ">
          <div className="flex flex-col px-4">
            <span className="text-5xl"></span>
            {Convertkalvintocelcius(firstData?.main.temp ?? 0)}°
            <p className="text-xs space-x-1 whitespace-nowrap">
              <span>Feels Like</span>
              <span>{Convertkalvintocelcius(firstData?.main.feels_like ?? 0)}°</span>
            </p>
          </div>
          </Container>
        </div>
      </section>
      {/* 7 days data */}
      <section></section>
    </main>
   </div>
  )
}
