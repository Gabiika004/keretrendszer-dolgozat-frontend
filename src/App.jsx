import { useEffect, useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.css'
import "bootstrap/dist/js/bootstrap.bundle"
import CelebrityForm from './components/CelebrityForm';
import CelebritiyCard from './components/CelebrityCard';

function App() {
  const url = "http://localhost:8000/api/celebrities";
  const [celebrities, setCelebrities] = useState([]);
  const [editingCelebrity, setEditingCelebrity] = useState(null);


  const getAllCelebrities = async () => {
    const response = await fetch(url);
      if(response.ok){
        const data = await response.json();
        setCelebrities(data);
      }
      else{
        setCelebrities([]);
      }
  }

  const createCelebrity = async celebrity => {
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(celebrity),
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      });
  
      if (response.ok) {
        // Sikeres kérés esetén frissítjük a hírességek listáját
        getAllCelebrities();
        return { success: true };
      } else {
        // Ha a válasz nem OK, hibaobjektumot adunk vissza a státuszkóddal és az üzenettel
        const errorText = await response.text(); // vagy response.json(), ha a szerver JSON formátumban küld hibát
        return { success: false, status: response.status, message: errorText };
      }
    } catch (error) {
      // Hálózati hiba vagy egyéb probléma esetén
      console.error("Hiba történt az API kérés során:", error);
      return { success: false, message: error.toString() };
    }
  };

  const deleteCelebrity = async (id) => {
    if (window.confirm(`Valóban törölni szeretnéd a hírességet?`)) {
      const response = await fetch(`${url}/${id}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        alert('Híresség sikeresen törölve.');
        getAllCelebrities();
      }
      else {
        alert('Hiba történt a törlés során.');
      }
    }
  };

  const updateCelebrity = async (id, celebrityData) => {
    try {
        const response = await fetch(`${url}/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(celebrityData),
        });

        const data = await response.json();

        if (response.ok) {
            getAllCelebrities();
            return { success: true };
        } else {
            setErrors(data.errors || {});
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error("Hiba történt az API kérés során:", error);
        return { success: false, message: error.toString() };
    }
};

  
  const startEditCelebrity = (celebrity) => {
    setEditingCelebrity(celebrity);
  };
  
  
  useEffect (()=>{
    getAllCelebrities();
  },[]);

  return (
  <main className='container'>
    <section>
      <h2 className='m-2'>Új híresség felvétele</h2>

        <CelebrityForm 
          onSubmit={createCelebrity} 
          editingCelebrity={editingCelebrity} 
          onUpdate={updateCelebrity} 
          onResetEditingCelebrity={() => setEditingCelebrity(null)}
        />

    </section>
    <section>
      <h2 className='m-4'>Hírességek</h2>

    {
      celebrities.length > 0 ? 
      <CelebritiyCard celebrities = {celebrities} 
                      onDelete={deleteCelebrity} 
                      editingCelebrity={editingCelebrity}
                      onEdit={startEditCelebrity}/> :

      <h4 className='text-danger'>Nem található híresség az adatbázisban.</h4>
    }
    </section>
  </main>
  )
}

export default App
