import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Context } from '../context/Context';
import { Link } from 'react-router-dom';

const Guide = () => {
  const { user } = useContext(Context);
  const [guides, setGuides] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [isAddingGuide, setIsAddingGuide] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [searchRating, setSearchRating] = useState('');
  const [newGuide, setNewGuide] = useState({
    title: '',
    author: '',
    summary: '',
    rating: 0
  });
  const [associatedCourses, setAssociatedCourses] = useState([]);
  const { title, author, summary, rating } = newGuide;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGuide((prevGuide) => ({
      ...prevGuide,
      [name]: value,
    }));
  };

  console.log(associatedCourses);

  const fetchGuides = async () => {
    const res = await axios.get("/guides");
    setGuides(res.data);
  }

  useEffect(() => {
    fetchGuides();
  }, []);

  useEffect(() => {
    if (selectedGuide) {
      console.log(selectedGuide.id);
      axios.get(`/guides/${selectedGuide.id}/courses`)
        .then(response => {
          setAssociatedCourses(response.data);
        })
        .catch(error => {
          console.error('Error fetching associated courses:', error);
        });
    }
  }, [selectedGuide]);

  const openAddGuideForm = () => {
    setIsAddingGuide(true);
  };

  const closeAddGuideForm = () => {
    setIsAddingGuide(false);
  };

  const handleAddGuideSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/guides', { ...newGuide }, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      console.log(response);
      console.log('Guide added successfully:', response.data);
      closeAddGuideForm();
      fetchGuides();
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const handleSearch = (guide) => {
    const nameMatch = guide.title.toLowerCase().includes(searchName.toLowerCase());
    const ratingMatch = guide.rating.toString().includes(searchRating);
    return nameMatch && ratingMatch;
  };
  
  const filteredGuides = guides.filter(handleSearch);

  console.log(selectedGuide)

  return (
    <div class="flex flex-col items-center">
      <h1 class="text-4xl font-bold mb-8">Liste des guides</h1>
      <div className="mb-4">
        <label htmlFor="searchName" className="block text-sm font-medium mb-2 text-center">
          Recherche par nom
        </label>
        <input
          type="text"
          id="searchName"
          className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:border-black"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="searchRating" className="block text-sm font-medium mb-2 text-center">
          Recherche par note
        </label>
        <input
          type="number"
          id="searchRating"
          className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:border-black"
          value={searchRating}
          onChange={(e) => setSearchRating(e.target.value)}
        />
      </div>
      <div class="flex items-center justify-center w-full">
        <div class="flex-1 p-4 text-center">
          {filteredGuides.map((guide, index) => (
            <div key={index} class="border rounded-md mb-4 overflow-hidden" onClick={() => setSelectedGuide(guide)}>
              <div class="bg-gray-100 px-4 py-3 cursor-pointer">
                <p class="text-center text-2xl">{guide.title}</p>
              </div>
            </div>
          ))}
          {user?.isAdmin && (
            <button
              onClick={openAddGuideForm}
              className="bg-black text-white text-2xl font-bold w-full border rounded-md overflow-hidden h-12 hover:bg-gray-800"
            >
              +
            </button>          
          )}
        </div>
        <div className="flex-1 p-4 text-center relative">
          {selectedGuide ? (
            <div className="bg-white px-4 py-3">
              <p className="text-center text-xl font-bold mb-4">Détails du guide</p>
              <ul>
                <li className="text-center text-xl">Titre:</li>
                <li className="text-center text-xl font-bold mb-4">{selectedGuide?.title}</li>
                <li className="text-center text-xl">Auteur:</li>
                <li className="text-center text-xl font-bold mb-4">{selectedGuide?.author}</li>
                <li className="text-center text-xl">Résumé:</li>
                <li className="text-center text-xl font-bold mb-4">{selectedGuide?.summary}</li>
                <li className="text-center text-xl">Note:</li>
                <li className="text-center text-xl font-bold mb-4">{selectedGuide?.rating}</li>
                <li className="text-center text-xl">Formations qui en parlent:</li>
                <ul>
                  {associatedCourses.map(course => (
                    <li className="text-center text-xl font-bold" key={course.id} >
                      <a
                        href={`/courses/${course.id}`} // Redirige vers la page de la liste de cours avec l'ID du cours comme paramètre
                        target="_blank" // Ouvrir dans un nouvel onglet si nécessaire
                        rel="noopener noreferrer"
                      >
                        {course.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </ul>
            </div>
          ) : (
            <div>
              <p>Sélectionnez un guide pour afficher les détails.</p>
            </div>
          )}
        </div>
        {isAddingGuide && (
          <div class="fixed inset-0 flex items-center justify-end bg-gray-800 bg-opacity-50">
            <div className="bg-white shadow-md p-4 h-2/3 w-1/3 mr-16">
              <h2 className="text-xl font-bold mb-8 text-center">Ajouter un guide</h2>
              <form onSubmit={handleAddGuideSubmit}>
                <div className="mb-8">
                  <label htmlFor="title" className="block text-sm font-medium mb-2">
                    Titre
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:border-black"
                    value={title}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-8">
                  <label htmlFor="author" className="block text-sm font-medium mb-2">
                    Auteur
                  </label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:border-black"
                    value={author}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-8">
                  <label htmlFor="summary" className="block text-sm font-medium mb-2">
                    Résumé
                  </label>
                  <textarea
                    id="summary"
                    name="summary"
                    rows="4"
                    className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:border-black"
                    value={summary}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-8">
                  <label htmlFor="rating" className="block text-sm font-medium mb-2">
                    Note
                  </label>
                  <input
                    type="number"
                    id="rating"
                    name="rating"
                    className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:border-black"
                    value={rating}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col justify-center items-center mt-8">
                  <button
                    type="submit"
                    className="w-full px-3 py-2 bg-black text-white rounded hover:bg-gray-800"
                  >
                    Ajouter le guide
                  </button>
                  <button
                    type="button"
                    onClick={closeAddGuideForm}
                    className="w-full px-3 py-2 bg-gray-300 text-gray-700 rounded mt-8 hover:bg-gray-400"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Guide