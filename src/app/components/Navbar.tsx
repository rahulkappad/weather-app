'use client'

import React, { useState } from 'react';
import { MdWbSunny, MdMyLocation, MdOutlineLocationOn } from "react-icons/md";
import Searchbox from './Searchbox';
import axios from 'axios';
import { loadingCityAtom, placeAtom } from '../atom';
import { useAtom } from 'jotai';

type Props = {location?:string} ;

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY || "";

export default function Navbar({location}: Props) {

  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [Suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const[place, setPlace] = useAtom(placeAtom)
  const[ ,setLoading] = useAtom(loadingCityAtom)

  async function handleInputChange(value: string) {
    setCity(value);
    if (value.length >= 3) {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${API_KEY}`);
        const suggestions = response.data.list.map((item: any) => item.name);
        setSuggestions(suggestions);
        setError("");
        setShowSuggestions(true);
      } catch (error) {
        setSuggestions([]);
        setShowSuggestions(false);
        setError("Unable to fetch suggestions");
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }

  function handleSuggestionClick(value: string) {
    setCity(value);
    setShowSuggestions(false);
  }

  function handleSubmitSearch(e: React.FormEvent<HTMLFormElement>) {
    setLoading(true);
    e.preventDefault();
    if(Suggestions.length===0){
      setError("Location Not Found");
      setLoading(false);
    }
    else{
      setError("");
      setTimeout(() => {
        setLoading(false);
      setPlace(city);
      setShowSuggestions(false);
      }, 500);
    }
  }

  function handleCurrentLocation (){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async(postion)=>{
        const {latitude,longitude}= postion.coords;
        try {
          setLoading(true);
          const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
        );
        setTimeout(()=>{
          setLoading(false);
          setPlace(response.data.name);
        },500)
        } catch (error) {
          setLoading(false);
        }
      })
    }
  }

  return  (
    <>
    <nav className='shadow-sm sticky top-0 left-0 z-50 bg-white'>
      <div className='h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto'>
        <p className='flex items-center justify-center gap-2 text-gray-500 text-3xl'>
          Weather
          <MdWbSunny className='text-3xl mt-1 text-yellow-300'/>
        </p>
        <section className='flex gap-2 items-center'>
          <MdMyLocation 
          title='Your Current Location'
          onClick={handleCurrentLocation}
          className='text-2xl text-gray-400 hover:opacity-80 cursor-pointer'/>
          <MdOutlineLocationOn className='text-3xl'/>
          <p className='text-slate-900/80 text-sm'>{location}</p>
          <div className='relative hidden md:flex'>
            <Searchbox
              value={city}
              onSubmit={handleSubmitSearch}
              onChange={(e) => handleInputChange(e.target.value)}
            />
            <SuggestionBox
              showSuggestions={showSuggestions}
              Suggestions={Suggestions}
              handleSuggestionClick={handleSuggestionClick}
              error={error}
            />
          </div>
        </section>
      </div>
    </nav>
    <section className='flex max-w-7xl px-3 md:hidden'>
    <div className='relative'>
            <Searchbox
              value={city}
              onSubmit={handleSubmitSearch}
              onChange={(e) => handleInputChange(e.target.value)}
            />
            <SuggestionBox
              showSuggestions={showSuggestions}
              Suggestions={Suggestions}
              handleSuggestionClick={handleSuggestionClick}
              error={error}
            />
          </div>
    </section>
    </>
  );
}

function SuggestionBox({
  showSuggestions,
  Suggestions,
  handleSuggestionClick,
  error
}: {
  showSuggestions: boolean;
  Suggestions: string[];
  handleSuggestionClick: (item: string) => void;
  error: string;
}) {
  return (
    <>
      {((showSuggestions && Suggestions.length > 0) || error) && (
        <ul className='mb-4 bg-white absolute border top-[44px] left-0 border-gray-300 rounded-md min-w-[200px]
          flex flex-col gap-1 py-1 px-2'>
          {error && Suggestions.length < 1 && (
            <li className='text-red-500 p-1'>{error}</li>
          )}
          {Suggestions.map((item, i) => (
            <li key={i} 
              onClick={() => handleSuggestionClick(item)}
              className='cursor-pointer p-1 rounded hover:bg-gray-200'>
              {item}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
