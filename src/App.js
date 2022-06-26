import './App.css';
import { useState } from 'react';
import axios from 'axios'
import { useForm } from 'react-hook-form';
import NeoDataTable from './Components/DataTable/DataTable';
import moment from 'moment';
import ChartData from './Components/ChartData/ChartData';


function App() {

  const [data, setData] = useState([]);
  const [visualData, setVisualData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0)
  const [first, setFirst] = useState(1);
  const { register, handleSubmit, formState: { errors }, setError, getValues } = useForm();

  const average = (value1, value2) => {
    return (value1 + value2) / 2;
  }

  const getData = async (val, page = 1) => {
    try {
      document.body.classList.add('loading-indicator');
      const res = await axios.get(`https://api.nasa.gov/neo/rest/v1/neo/browse?start_date=${moment().subtract(7, 'days').format('YYYY-MM-DD')}&page=${page}&end_data=${moment().format('YYYY-MM-DD')}&api_key=${val}`);
      const value = res?.data?.near_earth_objects.map(q => ({
        ...q, avgDiameter: average(
          q.estimated_diameter.kilometers['estimated_diameter_min'],
          q.estimated_diameter.kilometers['estimated_diameter_max']),
        miss_distance: q?.close_approach_data[0]?.miss_distance?.kilometers,
        is_potentially_hazardous_asteroid: q?.is_potentially_hazardous_asteroid ? 'Yes' : 'No',
      }));
      setTotalRecords(res?.data?.page?.total_elements);
      setData(value);
      setVisualData([['Name', 'Avg Diameter in km', 'Miss Disatnce in km'],
      ...value.map(q => ([q?.name, q?.avgDiameter, Number(q?.miss_distance)]))])
      document.body.classList.remove('loading-indicator');

    } catch (error) {
      document.body.classList.remove('loading-indicator');
      console.log(error)
      if (error?.response?.status === 403) {
        setData([]);
        setTotalRecords(0);
        setVisualData([]);
        setError('accessKey', {
          message: error?.response?.data?.error?.message
        }, {
          shouldFocus: true
        })
      }
    }
  }

  const save = async (val) => {
    getData(val?.accessKey)
  }

  const changePage = (event) => {
    console.log(event)
    setFirst(event?.first)
    getData(getValues('accessKey'), event?.page + 1)
  }

  return (
    <div className='container'>
      <form onSubmit={handleSubmit(save)} style={{ marginTop: '30px' }}>
        <div className='form-group'>
          <label>NASA NEO Access key:</label>
          <input className='form-control' placeholder='Access Key' type={'text'}  {...register("accessKey", {
            required: 'Required Input'
          })} />
          {
            errors?.accessKey && (
              <small className='text-danger mt-3 ms-3'>{errors?.accessKey?.message}</small>
            )
          }
        </div>
        <button className='btn btn-primary mt-2' type='submit'>Get Data</button>
      </form>
      {
        data.length > 0 && (
          <>
            <NeoDataTable data={data} totalRecords={totalRecords} changePage={changePage} first={first} />
            <ChartData data={visualData} />
          </>
        )
      }
    </div>
  );
}

export default App;
