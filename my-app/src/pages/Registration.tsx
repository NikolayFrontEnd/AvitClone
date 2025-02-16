import { useState } from 'react'; 
import styles from './Registration.module.css'; 
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';


interface FormData {
  name: string;
  password: string;
}

interface ServerResponse {
  id: number;
  error?: string;
}

const Registration = () => { 
    const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>({ 
    name: '', 
    password: '', 
  }); 

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
    const { name, value } = e.target; 
    setFormData((prevData) => ({ ...prevData, [name]: value })); 

    setError(null);
  }; 

  const handleSubmit = async (e: React.FormEvent) => { 
    e.preventDefault(); 
    setLoading(true);
    try { 
      const res = await axios.post<ServerResponse>('/api/Createuser', formData);
      localStorage.setItem('userId', String(res.data.id)); 
      navigate('/')
    } catch (err) { 

      if (axios.isAxiosError(err)) {
        setError(err.response?.data.error || 'Ошибка при регистрации');
      } else {
        setError('Неизвестная ошибка');
      }
    } finally {
      setLoading(false);
    }
  }; 

  return ( 
    <form onSubmit={handleSubmit} className={styles.formcontainer}> 
      {error && <div className={styles.error}>{error}</div>}
      <div > 
        <input 
          type="text" 
          name="name" 
          placeholder="Имя пользователя" 
          value={formData.name} 
          onChange={handleChange} 
          required 
          className={`${styles.inputfield}`}
          disabled={loading}
        /> 
      </div> 
      <div > 
        <input 
          type="password" 
          name="password" 
          placeholder="Пароль" 
          value={formData.password} 
          onChange={handleChange} 
          required 
          className={`${styles.inputfield}`}
          disabled={loading}
        /> 
      </div> 
      <button 
        type="submit" 
        className={styles.submitbutton}
        disabled={loading}
      > 
        {loading ? 'Загрузка...' : 'Зарегистрироваться'}
      </button> 
    </form> 
  ); 
}; 

export default Registration;