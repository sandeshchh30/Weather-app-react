import { useCallback, useEffect, useState, component } from 'react'
import './App.css'
import IconSearch from './components/IconSearch'
import Temperature from './components/Temperature';
import cross from './assets/cross.png'
import cut from './assets/cut.png'

function App() {

  const [search, setSearch] = useState("jaipur");
  const [data, setData] = useState()
  const [fetched, setFetched] = useState(true)

  const api = `https://api.openweathermap.org/data/2.5/weather?q=${search}&units=Metric&appid=9204520d7658ba2b3d9aad55cd293d4d`

  useEffect(() => {
    change();
  }, [])

  const cutError = () => {
    setSearch("jaipur");
    change();
  }

  const change = () => {
    console.log("Fetching...")
    fetch(api)
      .then((res) => res.json())
      .then((res) => {
        if(res.main){
          setFetched(true);
          console.log(res)
          setData(res);
        }
        else setFetched(false);
      })
      .catch((e) => console.log(e));
  }

  return (
    <div className='w-full h-screen bg-blue-200 flex justify-center items-center'>
      <div className='w-10/12 pb-10 md:w-5/12 p-4 rounded-md bg-gradient-to-b from-sky-500 to-indigo-500'>

        <div className='flex justify-around'>

          <input
            type="text"
            placeholder='search'
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') change();
            }}
            className='px-3 py-2 outline-none w-10/12 rounded-3xl md:text-xl md:px-4 font-medium'
          />

          <div
            className='py-2 px-2 bg-white rounded-full ml-3 md:px-3'
            onClick={change}
          >
            <IconSearch />
          </div>

        </div>

        <div>
          {fetched && <Temperature message={data} />}

          {!fetched &&
            <div className='flex justify-center'>
              <div className='w-3/4 mt-[15%]'>
                <div className='w-full h-8 flex items-center bg-[#ffbc5a]'>
                  <button 
                    className='w-5 h-5 flex justify-center items-center bg-[#662800] hover:bg-[#662800]/90 rounded-full ml-2'
                    onClick={cutError}  
                  >
                    <img className='w-2.5' src={cut} alt="x" />
                  </button>
                </div>
                <div className='h-28 sm:h-40 bg-[#ffe3b8]'>
                  <div className='flex justify-evenly items-center h-full'>
                    <div className='w-[20%]'>
                      <img src={cross} alt="Error" />
                    </div>
                    <div className='text-xl sm:text-[3rem] font-medium'>Error!</div>
                  </div>
                </div>
              </div>
            </div>
          }

        </div>

      </div>
    </div>
  )
}

export default App
