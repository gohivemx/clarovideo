import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [data, setData] = useState(null)
  const [card, setCard] = useState('')
  const [show, setShow] = useState(false)
  const elementRef = useRef(null)
  const lineBreak = "\r\n"


  const handleHorizantalScroll = (element, speed, distance, step) => {
    let scrollAmount = 0;
    const slideTimer = setInterval(() => {
      element.scrollLeft += step
      scrollAmount += Math.abs(step)
      if (scrollAmount >= distance) {
        clearInterval(slideTimer);
      }
    }, speed)
  }

  useEffect(() => {
    try {
      const getChannels = async () => {
        const response = await fetch('https://mfwkweb-api.clarovideo.net/services/epg/channel?device_id=web&device_category=web&device_model=web&device_type=web&device_so=Chrome&format=json&device_manufacturer=generic&authpn=webclient&authpt=tfg1h3j4k6fd7&api_version=v5.93&region=guatemala&HKS=web61144bb49d549&user_id=54343080&date_from=20240315180000&date_to=20240316160000&quantity=70')
        const data = await response.json()
        setData(data.response.channels)
      }
      getChannels()
    }
      catch {
        console.log("API ERROR")
      }
  }, [])

  function handleHover(e) {
    setCard(e.target.textContent)
  }
  return (
    <>
      {
        show ?
          <div className='container'>
            <div className='hide-button' onClick={() => setShow(prevShow => !prevShow)}>✕</div>
            <div className='card-info'>
              {card && <div>{card}</div>}
            </div>
            <div className="button-container">
              <button onClick={() => {handleHorizantalScroll(elementRef.current, 10, 200, -20);}}>‹</button>
              <button onClick={() => {handleHorizantalScroll(elementRef.current, 10, 200, 20);}}>›</button>
            </div>
            <div className='channel-guide' ref={elementRef}>
              <ul className='timestamp'>
                <li></li><li>18:00</li><li>19:00</li><li>20:00</li><li>21:00</li><li>22:00</li><li>23:00</li><li>00:00</li><li>01:00</li><li>02:00</li><li>03:00</li><li>04:00</li><li>05:00</li><li>06:00</li><li>07:00</li><li>08:00</li><li>09:00</li><li>10:00</li><li>11:00</li><li>12:00</li><li>13:00</li><li>14:00</li><li>15:00</li><li>16:00</li><li>17:00</li><li>18:00</li>
              </ul>
              <ul className='channels'>
                {data && data.map(item => {
                  return (
                    <li key={item.id}>
                      <div className='channel-info'>
                        <div className='channel-number'>{item.number}</div>
                        <div className='channel-img'><img src={item.image} /></div>
                      </div>
                      <div>
                        <div className='program-info'>{item.events.map((event, index) => {
                          return (
                            <div key={index} className='program'
                              style={{width: `${((event.unix_end - event.unix_begin)/36)*3}px` }}
                                onMouseEnter={e => handleHover(e)}>
                              <strong>{event.name}</strong><br/>{lineBreak}{(event.date_begin).split(' ').pop().slice(0, -3)+ "hrs"} – {(event.date_end).split(' ').pop().slice(0, -3) + "hrs"}<br/>{lineBreak}<span className='hidden'>{event.description}</span>
                            </div>
                            )
                          })}
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        :
          <div className='show-button'>
            <button onClick={() => setShow(prevShow => !prevShow)}>Mostrar EPG</button>
          </div>
      }
    </>
  )
}

export default App
