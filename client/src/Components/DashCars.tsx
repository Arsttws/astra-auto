import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { CircularProgressbar } from 'react-circular-progressbar'
import ReactQuill from 'react-quill'
import { app } from '../firebase'

import styles from '../styles/modules/dashCars.module.scss'

export default function DashCars(cars: any) {
  const navigate = useNavigate()
  
  const [image, setImage] = useState<any>(null)
  const [imageUploadProgress, setImageUploadProgress] = useState<any>(null)
  const [imageUploadError, setImageUploadError] = useState<any>(null)
  const [brands, setBrands] = useState<any>([])
  const [formData, setFormData] = useState<any>({})
  const [publishError, setPublishError] = useState<any>(null)
  // const [loading, setLoading]  =useState<boolean>(false)
  // const [showMore, setShowMore] = useState<boolean>(false)
  let carsBrands: any[] = []

  
  const fetchCars = async () => {
    carsBrands = []
    const res = await fetch('https://cars-base.ru/api/cars?full=1')
    const data = await res.json()
    for (let i = 0; i < data.length; i++) {
      data[i].popular && carsBrands.push(data[i].name);
    }
    console.log(carsBrands);
    
    
    return
  }

//   const fetchBrands = async () => {
  //     try {
    //       const res = await fetch(`https://cars-base.ru/api/cars?full=1`)
//         const data = await res.json();
//         // data.map((popularCar: any) => (
//         //   setBrands(popularCar)
//         // ))
//         // for (let i = 0; i<data.length; i++) {
//         //   if(data[i].popular){
//         //     setBrands([...brands, data[i].name]);
//         //   } 
//           return data
//         // }
//       console.log(brands);
//       } catch(error){
//         console.log(error);
//         return
//       }
// }


//   fetchBrands()



  const handleImageUpload = async() => {
    try {
        if(!image) {
            setImageUploadError('Выберите фото')
            return
        }
        setImageUploadError(null)
        const storage = getStorage(app);
        const fileName = new Date().getTime() + '-' + image.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageUploadProgress(progress.toFixed(0))
            },
            (error) => {
                setImageUploadError('Ошибка загрузки картинки')
                setImageUploadProgress(null)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl: string) => {
                    setImageUploadProgress(null);
                    setImageUploadError(null);
                    setFormData({...formData, image: downloadUrl})
                }) 
            }
        )
    } catch (error) {
        setImageUploadError('Ошибка загрузки картинки')
        setImageUploadProgress(null)
    }
}

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try{
        const res = await fetch('/api/car/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        if(!res.ok) {
            setPublishError(data.message)
            return
        }
        if(res.ok) {
            setPublishError(null)
        }
    } catch(error){
        setPublishError('Что-то пошло не так')
    }
}


  return (
    <div>
      <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.carInfo}>
                <input className={styles.brand} type="text" placeholder="Введите название..." required onChange={(e)=> setFormData({...formData, brand: e.target.value})} />
                <button onClick={fetchCars}>000</button>
                <div>
                {brands.map((car: any) => (
                  <div key={car.name}><p>{car.name}</p></div>
                ))}
                </div>
                <select className={styles.category} name="categories" id="category-select" onChange={(e)=> setFormData({...formData, model: e.target.value})}required>
                    <option value="">Выберите категорию</option>
                    <option value="news">Новости</option>
                    <option value="post">Статьи</option>
                    <option value="discount">Акции</option>
                </select>
            </div>
            <div className={styles.imgSelect}>
                <input className={styles.chooseImage} type="file" accept="image/*" onChange={(e:any) => setImage(e.target.files[0])} />
                <button className={styles.addImage} onClick={handleImageUpload} disabled={imageUploadProgress}>
                    {
                        imageUploadProgress ? <div>
                            <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
                        </div> : 'Добавить картинку'
                    }
                </button>
            </div>
            {imageUploadError && (
                <div><p>{imageUploadError}</p></div>
            )}
            {formData.image && (
                <img src={formData.image} alt="uploaded-img" />
            )}
            <ReactQuill className={styles.quill} theme="snow" placeholder="Введите текст статьи" onChange={(value)=> setFormData({...formData, content: value})} />
            <button className={styles.publish} type="submit">
                Добавить
            </button>
            {publishError && <div><p>{publishError}</p></div>}
        </form>
    </div>
  )
}
