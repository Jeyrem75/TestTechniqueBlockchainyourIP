import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Context } from '../context/Context';
import { useParams } from 'react-router-dom';

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [open, setOpen] = useState({});
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationText, setRegistrationText] = useState('');
  const [newCourse, setNewCourse] = useState({
    name: '',
    date: '',
    instructor: '',
    guides: [],
    attendees: [],
  });
  const [guides, setGuides] = useState([]);
  const [selectedGuides, setSelectedGuides] = useState([]);
  
  const { user } = useContext(Context);

  const { name, date, instructor } = newCourse;

  const { id } = useParams();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prevCourse) => ({
      ...prevCourse,
      [name]: value,
    }));
  };

  const fetchCourses = async () => {
    const res = await axios.get("/courses", {
      headers: {
        Authorization: `Bearer ${user.accessToken}`, // Utilisez le token JWT stocké dans le local storage
      },
    })
    setCourses(res.data);
    setOpen(Array(res.data.length).fill(false));
  }

  useEffect(() => {
    fetchCourses();
  });

  useEffect(() => {
    let timer;
    if (isRegistering) {
      timer = setTimeout(() => {
        setIsRegistering(false);
        setRegistrationText('');
      }, 180000); // 3 minutes in milliseconds
    }
    return () => clearTimeout(timer);
  }, [isRegistering]);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await axios.get('/guides', {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        });
        setGuides(response.data);
      } catch (error) {
        console.error('Error fetching guides:', error);
      }
    };
  
    fetchGuides();
  }, [user.accessToken]);

  useEffect(() => {
    if (id) {
      axios.get(`/courses/${id}`, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        })
        .then(response => {
          setOpen(prevOpen => ({ ...prevOpen, [id]: true }));
        })
        .catch(error => {
          console.error('Error fetching course details:', error);
        });
    }
  }, [id, user.accessToken]);

  const toggleOpen = (courseId) => {
    setOpen(prevOpenCourses => ({
      ...prevOpenCourses,
      [courseId]: !prevOpenCourses[courseId]
    }));
  };

  const openAddCourseForm = () => {
    setIsAddingCourse(true);
  };

  const closeAddCourseForm = () => {
    setIsAddingCourse(false);
  };

  const handleAddCourseSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/courses', { ...newCourse, guides: selectedGuides, }, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      console.log(response);
      console.log('Course added successfully:', response.data);
      closeAddCourseForm();
      fetchCourses();
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const handleSearch = (course) => {
    const nameMatch = course.name.toLowerCase().includes(searchName.toLowerCase());
    const dateMatch = course.date.includes(searchDate);
    return nameMatch && dateMatch;
  };
  
  const filteredCourses = courses.filter(handleSearch);

  const reserveCourse = async (courseId, motivation) => {
    try {
      const response = await axios.post(
        `/courses/${courseId}/reserve`,
        { motivation },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      console.log('Course reserved');
    } catch (err) {
      console.error('Error reserving course:', err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-4xl font-bold mb-8">Liste des formations</h1>
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
            <label htmlFor="searchDate" className="block text-sm font-medium mb-2 text-center">
              Recherche par date
            </label>
            <input
              type="date"
              id="searchDate"
              className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:border-black"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
          </div>
          {filteredCourses.map((course, index) => (
            <div key={index} className="w-3/4 border rounded-md mb-8 overflow-hidden">
              <div className="bg-gray-100 px-4 py-3 cursor-pointer" onClick={() => toggleOpen(course.id)}>
                <p className="text-center text-2xl">{course.name}</p>
              </div>
              {open[course.id] && (
                <div className="bg-white px-4 py-3">
                  <p className="text-center text-xl font-bold mb-4">Détail du cours</p>
                  <ul>
                    <li className="text-center text-xl">Intervenant:</li>
                    <li className="text-center text-xl font-bold mb-4">{course.instructor}</li>
                    <li className="text-center text-xl">Date:</li>
                    <li className="text-center text-xl font-bold mb-4">{course.date}</li>
                  </ul>
                  <div className="flex justify-center items-center">
                    <button
                      onClick={() => setIsRegistering(true)}
                      className="bg-black text-white text-2xl font-bold w-1/4 border rounded-lg"
                    >
                      S'inscrire à cette formation
                    </button>
                  </div>
                    {isRegistering && (
                      <div className="flex justify-center items-center mt-4">
                        <input
                          type="text"
                          placeholder="Entrez votre texte ici..."
                          className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:border-black"
                          value={registrationText}
                          onChange={(e) => setRegistrationText(e.target.value)}
                        />
                        <button
                          onClick={() => {
                            reserveCourse(course.id, registrationText); // Appeler la fonction de réservation
                            setIsRegistering(false);
                            setRegistrationText('');
                          }}
                          className="bg-black text-white text-sm font-medium px-2 ml-2 rounded"
                        >
                          Envoyer
                        </button>
                        <button
                          onClick={() => {
                            setIsRegistering(false);
                            setRegistrationText('');
                          }}
                          className="bg-gray-300 text-gray-700 text-sm font-medium px-2 ml-2 rounded"
                        >
                          Annuler
                        </button>
                      </div>
                    )}
                </div>
              )}
            </div>
          ))}
          {user.isAdmin && (
            <button 
              onClick={openAddCourseForm} 
              className="bg-black text-white text-2xl font-bold w-3/4 border rounded-md overflow-hidden h-12 hover:bg-gray-800"
            >
              +
            </button>
          )}
          {isAddingCourse && (
          <div className="fixed inset-0 flex items-center justify-end bg-gray-800 bg-opacity-50">
            <div className="bg-white shadow-md p-4 h-2/3 w-1/3 mr-16">
              <h2 className="text-xl font-bold mb-8 text-center">Ajouter une formation</h2>
              <form onSubmit={handleAddCourseSubmit}>
                <div className="mb-8">
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:border-black"
                    value={name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-8">
                  <label htmlFor="date" className="block text-sm font-medium mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:border-black"
                    value={date}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-8">
                  <label htmlFor="instructor" className="block text-sm font-medium mb-2">
                    Intervenant
                  </label>
                  <input
                    type="text"
                    id="instructor"
                    name="instructor"
                    className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:border-black"
                    value={instructor}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-8">
                  <label htmlFor="guides" className="block text-sm font-medium mb-2">
                    Guides
                  </label>
                  <select
                    id="guides"
                    name="guides"
                    multiple
                    className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:border-black"
                    value={selectedGuides}
                    onChange={(e) => setSelectedGuides(Array.from(e.target.selectedOptions, option => option.value))}
                  >
                    {guides.map((guide) => (
                      <option key={guide.id} value={guide.id}>
                        {guide.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col justify-center items-center mt-8">
                  <button
                    type="submit"
                    className="w-full px-3 py-2 bg-black text-white rounded hover:bg-gray-800"
                  >
                    Ajouter la formation
                  </button>
                  <button
                    type="button"
                    onClick={closeAddCourseForm}
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

export default Course