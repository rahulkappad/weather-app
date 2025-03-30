'use client'

import Image from "next/image";
import Navbar from "./components/Navbar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format, fromUnixTime } from "date-fns";
import { parseISO } from "date-fns/fp";
import Container from "./components/Container";
import { Convertkalvintocelcius } from "./utils/Convertkalvintocelcius";
import Weathericon from "./components/Weathericon";
import { getDayOrNightIcon } from "./utils/getDayOrNightIcon";
import { MetersToKilometer } from "./utils/MetersToKilometer";
import Weatherdetails from "./components/WeatherDetail";
import { ConvertWindSpeed } from "./utils/ConvertWindSpeed";
import ForecastWeatherDetail from "./components/ForecastWeatherDetail";
import { useAtom } from "jotai";
import { loadingCityAtom, placeAtom } from "./atom";
import { useEffect } from "react";


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

  const[place, setPlace] = useAtom(placeAtom) 
  const[ loadingCity,] = useAtom(loadingCityAtom)
  
  const { isPending, error, data ,refetch} = useQuery<WeatherData>({
    queryKey: ['repoData'],
    queryFn: async ()=>
    {
      const {data} = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`)
      return data;
    }
  });

  useEffect(() => {
    refetch();
  }, [place,refetch])
  

  const firstData = data?.list[0];

  

  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    )
  ];

  const firstDateForEachData = uniqueDates.map((date)=>{
    return data?.list.find((entry)=>{
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0]
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >=6;
    });
  });

  if (isPending) return <div className="flex items-center min-h-screen justify-center">
    <p className="animate-bounce">Loading...</p>
  </div>
  return (
   <div className="flext flex-col gap-2 bg-gray-100 min-h-screen">
    <Navbar location={data?.city.name}/>
    <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
      {/* Today data */}
      {loadingCity ? ( <SkeletonLoader/> ):
      <> 
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="flex gap-1 text-2xl items-end">
          <p className="text-2xl">{format(parseISO(firstData?.dt_txt ?? ''),'EEEE')}</p>
          <p className="text-lg">{format(parseISO(firstData?.dt_txt ?? ''),'dd.MM.yyyy')}</p>
          </h2>
          <Container className="gap-10 px-6 items-center  border-0">
            {/* temperature */}
          <div className="flex flex-col px-4">
            <span className="text-5xl">
            {Convertkalvintocelcius(firstData?.main.temp ?? 0)}°
            </span>
            <p className="text-xs space-x-1 whitespace-nowrap">
              <span>Feels Like</span>
              <span>{Convertkalvintocelcius(firstData?.main.feels_like ?? 0)}°</span>
            </p>
            <p className="text-xs space-x-2">
              <span>{Convertkalvintocelcius(firstData?.main.temp_min ?? 0)}°↓{" "}</span>
              <span>{" "}{Convertkalvintocelcius(firstData?.main.temp_max ?? 0)}°↑</span>
            </p>
          </div>
          {/* time and weather icon */}
          <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
            {data?.list.map((d,i)=>
            <div key={i} className="flex flex-col justify-between gap-2 items-center text-xs font-semibold">
              <p className="whitespace-nowrap">
                {format(parseISO(d.dt_txt),'h:mm a')}
              </p>
              {/* <Weathericon iconName={d.weather[0].icon}/> */}
              <Weathericon iconName={getDayOrNightIcon(d.weather[0].icon,d.dt_txt)}/>
              <p>{Convertkalvintocelcius(d?.main.temp ?? 0)}°</p>
            </div>
            )}
          </div>
          </Container>
        </div>
        <div className="flex gap-4">
            {/* left */}
          <Container className="w-fit justify-center flex-col px-4 items-center  border-0">
            <p className="capitalize text-center ">{firstData?.weather[0].description}</p>
            <Weathericon iconName={getDayOrNightIcon(firstData?.weather[0].icon ?? "",
              firstData?.dt_txt ?? "")}/>
          </Container>
            {/* right */}
          <Container className="bg-yellow-300/80 px-6 gap-4 justify-between overflow-x-auto  border-0">
              <Weatherdetails Visability={MetersToKilometer(firstData?.visibility ?? 10000)} 
              Humidity={`${firstData?.main.humidity} %`}
              WindSpeed={ConvertWindSpeed(firstData?.wind.speed ?? 1.64)}
              AirPressure={`${firstData?.main.pressure} hPa`}
              SunRise={format(fromUnixTime(data?.city.sunrise ?? 1743215369),'H:mm')}
              SunSet={format(fromUnixTime(data?.city.sunset ?? 1743259789),'H:mm')}
              />
          </Container>
        </div>
      </section>
      {/* 7 days data */}
      <section className="flex w-full flex-col gap-4">
           <p className="text-2xl">Forecast (7 days)</p>
                {firstDateForEachData.map((d, i) => (
                   <ForecastWeatherDetail
                    key={i}
      descrption={d?.weather[0].description ?? ""}
      WeatherIcon={d?.weather[0].icon ?? "01d"}
      date={d?.dt_txt ? format(parseISO(d.dt_txt.replace(" ", "T")), "dd.MM") : "N/A"}
      day={d?.dt_txt ? format(parseISO(d.dt_txt.replace(" ", "T")), "EEEE") : "N/A"}
      feels_like={d?.main.feels_like ?? 0}
      temp={d?.main.temp ?? 0}
      temp_max={d?.main.temp_max ?? 0}
      temp_min={d?.main.temp_min ?? 0}
      AirPressure={`${d?.main.pressure} hPa`}
      Humidity={`${d?.main.humidity ?? 0} %`}
      SunRise={format(fromUnixTime(data?.city.sunrise ?? 1743215369), "H:mm")}
      SunSet={format(fromUnixTime(data?.city.sunset ?? 1743259789), "H:mm")}
      Visability={MetersToKilometer(d?.visibility ?? 10000)}
      WindSpeed={ConvertWindSpeed(d?.wind.speed ?? 1.64)}
       />
             ))}
      </section>
      </>
      }
    </main>
   </div>
  )
}


const SkeletonLoader: React.FC = () => {
  return (
    <div className="flex flex-col gap-2 bg-gray-100 min-h-screen animate-pulse">
      {/* Navbar Placeholder */}
      <div className="h-12 bg-gray-300 w-full" />
      
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {/* Today Data Skeleton */}
        <section className="space-y-4">
          <div className="space-y-2">
            <div className="h-8 bg-gray-300 w-40 rounded" />
            <div className="bg-gray-300 h-48 w-full rounded-lg" />
            <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
              {Array.from({ length: 5 }).map((_, i: number) => (
                <div key={i} className="flex flex-col justify-between gap-2 items-center text-xs font-semibold">
                  <div className="h-4 w-12 bg-gray-300 rounded" />
                  <div className="h-10 w-10 bg-gray-300 rounded-full" />
                  <div className="h-4 w-8 bg-gray-300 rounded" />
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex gap-4">
            {/* Left Section */}
            <div className="flex flex-col items-center p-4 bg-gray-300 rounded-lg h-32 w-32" />
            {/* Right Section */}
            <div className="flex-grow bg-gray-300 h-32 rounded-lg" />
          </div>
        </section>

        {/* 7 Days Forecast Skeleton */}
        <section className="flex w-full flex-col gap-4">
          <div className="h-8 w-40 bg-gray-300 rounded" />
          {Array.from({ length: 7 }).map((_, i: number) => (
            <div key={i} className="flex justify-between items-center h-20 bg-gray-300 rounded-lg w-full p-4">
              <div className="h-6 w-24 bg-gray-400 rounded" />
              <div className="h-10 w-10 bg-gray-400 rounded-full" />
              <div className="h-6 w-16 bg-gray-400 rounded" />
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

