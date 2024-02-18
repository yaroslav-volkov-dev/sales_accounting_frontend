import { useEffect, useState } from 'react';

export const MainPage = () => {
  const [data, setData] = useState([]);
  const getData = async () => {
    const data = await  fetch('https://shopping-list-backend-wine.vercel.app/products')
    const parsedData = await data.json();
    setData(parsedData.data);
  }

  useEffect(() => {
    getData()
  }, []);


  return <div>{data.map(({ name, _id }) => (<div key={_id}>{name}</div>))}</div>
}