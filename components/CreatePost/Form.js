import React, { useEffect, useState } from "react";
import Data from "../../shared/Data";
import { useSession } from "next-auth/react";
import app from "./../../shared/FirebaseConfig";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, 
    ref, uploadBytes } from "firebase/storage";
import Toast from "../Toast";
export default function Form() {
  const [inputs, setInputs] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [file, setFile] = useState();
  const [submit, setSubmit] = useState(false);

  const { data: session } = useSession();
  const db = getFirestore(app);
  const storage = getStorage(app);
  useEffect(() => {
    if (session) {
      setInputs((values) => ({ ...values, userName: session.user?.name }));
      setInputs((values) => ({ ...values, userImage: session.user?.image }));
      setInputs((values) => ({ ...values, email: session.user?.email }));
    }
  }, [session]);

  useEffect(()=>{
    if(submit==true)
    {
        savePost();
    }

  },[submit])
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowToast(true);

    if (!file) {
        alert("Please select an image!");
        return;
    }

    try {
        // Create FormData to send file to Cloudinary
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "find-player"); // Replace with Cloudinary preset name

        // Upload to Cloudinary
        const res = await fetch(
            "https://api.cloudinary.com/v1_1/dkxebr6w7/image/upload", 
            { method: "POST", body: formData }
        );

        const data = await res.json();
        const imageUrl = data.secure_url; // Get uploaded image URL from Cloudinary

        // Save post details to Firestore
        const postId = Date.now().toString();
        const newPost = { ...inputs, image: imageUrl };

        await setDoc(doc(db, "posts", postId), newPost);

        setShowToast(true);
        setInputs({}); // Reset form
    } catch (error) {
        console.error("Error uploading image:", error);
    }
};

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setShowToast(true);
//     const storageRef = ref(storage, 'ninja-player/'+file?.name);
//     uploadBytes(storageRef, file).then((snapshot) => {
//         console.log('Uploaded a blob or file!');
//       }).then(resp=>{
//         getDownloadURL(storageRef).then(async(url)=>{
            
//             setInputs((values)=>({...values,
//                 image:url}));   

//             setSubmit(true);

//         }) 
//       }) ;
//     await setDoc(doc(db, "posts",Date.now().toString()),inputs)

     
//   };

  const savePost=async()=>{
    await setDoc(doc(db, "posts", Date.now().toString()), inputs);
  }
  return (
    <div className="mt-4">
      {showToast ? (
        <div className="absolute top-10 right-10">
          <Toast
            msg={"Post Created Successfully"}
            closeToast={() => setShowToast(false)}
          />
        </div>
      ) : null}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          required
          onChange={handleChange}
          className="w-full mb-4 border-[1px] p-2 rounded-md"
        />
        <textarea
          name="desc"
          className="w-full mb-4 
        outline-blue-400 border-[1px] 
        p-2 rounded-md"
          required
          onChange={handleChange}
          placeholder="Write Description here"
        />

        <input
          type="date"
          name="date"
          required
          onChange={handleChange}
          className="w-full mb-4 border-[1px] p-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Location"
          name="location"
          required
          onChange={handleChange}
          className="w-full mb-4 border-[1px] p-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Zip"
          name="zip"
          required
          onChange={handleChange}
          className="w-full mb-4 border-[1px] p-2 rounded-md"
        />
        <select
          name="game"
          onChange={handleChange}
          required
          className="w-full mb-4 border-[1px] p-2 rounded-md"
        >
          <option disabled defaultValue>
            Select Game
          </option>
          {Data.GameList.map((item) => (
            <option key={item.id}>{item.name}</option>
          ))}
        </select>
        <input
          type="file"
          onChange={(e)=>setFile(e.target.files[0])}
          accept="image/gif, image/jpeg, image/png"
          className="mb-5 border-[1px] w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 w-full p-1 
rounded-md text-white"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

//  Form;
