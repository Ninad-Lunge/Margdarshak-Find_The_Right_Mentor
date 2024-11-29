# Margdarshak - Find the Right Mentor for youself.
<img src="https://github.com/user-attachments/assets/398e2db4-991c-416d-a57c-29ae1f96c655" alt="Margadarshak" width="50%">

## 📚 Overview  
Margdarshak is an advanced web-based mentorship platform that bridges the gap between aspiring professionals and experienced mentors. Designed to provide personalized career guidance, skill development, and collaborative learning opportunities, Margadarshak offers a seamless and efficient mentoring experience.  

With features like automated session booking, an ATS-optimized resume builder, real-time chat, and mentor-driven communities, Margadarshak is your one-stop solution for professional growth and networking.  

---

1. Home Page:
![Home Page](https://github.com/user-attachments/assets/14182da4-b52d-4bcc-b0ec-8fae4f0575df)

2. Mentor Register:
![Mentor Register](https://github.com/user-attachments/assets/77117a13-1dc4-4e5a-abf5-a1cac58e54dc)

3. Mentee Register:
![Mentee Register](https://github.com/user-attachments/assets/0190882c-d656-43ea-b9ad-ac6e07668fd9)

4. Mentor Dashboard:
![Screenshot 2024-11-26 130846](https://github.com/user-attachments/assets/f57bf791-2199-444a-aea3-e381ba2e914f)

5. Set Availabilty:
![Screenshot 2024-11-26 130923](https://github.com/user-attachments/assets/61527799-0848-4586-a4a4-d08912dfcb58)

6. Manage Requests:
![Screenshot 2024-11-26 131005](https://github.com/user-attachments/assets/185d325d-3353-444d-b72e-18217b770984)

7. Create Communities:
![Screenshot 2024-11-26 131159](https://github.com/user-attachments/assets/b68f74d0-50f8-47ad-b6e6-68e4ae9a2937)

8. Mentor Profile:
![Screenshot 2024-11-26 131234](https://github.com/user-attachments/assets/4a301333-e9b9-49ee-9eba-cf8ee3efe013)

9. Mentee Dashboard:
![Screenshot 2024-11-26 130404](https://github.com/user-attachments/assets/ea836495-81d1-426c-9abe-8012262d0a7e)

10. Book Slots:
![Screenshot 2024-11-26 130449](https://github.com/user-attachments/assets/b0bda06f-151f-4353-86fb-42012e819f7c)

11. Join Communities:
![Screenshot 2024-11-26 130633](https://github.com/user-attachments/assets/e295a9a3-6706-4bbd-8194-46f613b04f62)

12. Mentee Profile:
![Screenshot 2024-11-26 130704](https://github.com/user-attachments/assets/f27307c8-bb3d-474f-bab9-16b27544d314)

## 🌟 Features  

### For Mentees  
- **Search and Connect with Mentors:** Discover mentors based on expertise and availability.  
- **Automated Session Booking:** Schedule mentorship sessions with automated email notifications.  
- **Resume Builder:** Create ATS-friendly resumes using templates and text extraction tools.  
- **Mentor Recommendations:** Get AI-driven mentor suggestions tailored to your profile.
- **Community Participation:** Join topic-specific communities for collaboration and networking.  
- **Follow Mentors:** Stay updated on mentor activities, blogs, and workshops.

### For Mentors  
- **Set Availability:** Manage availability and schedule mentorship sessions effortlessly.  
- **Conduct Virtual Sessions:** Host one-on-one or group mentoring sessions through embedded video calls.  
- **Collaborate through Communities:** Build and engage with communities of like-minded professionals.  
- **Write Blogs and Articles:** Share knowledge and expertise with mentees and other mentors.  
- **Host Workshops:** Conduct webinars to reach larger audiences and address specific skill areas.  

---

## 💻 Tech Stack  

### Frontend  
- **React.js:** For building dynamic and responsive user interfaces.  
- **Tailwind CSS:** For modern and utility-first styling.  

### Backend  
- **Node.js & Express.js:** For managing APIs and application logic.  
- **MongoDB Atlas:** For scalable and secure data storage.  

### APIs & Integrations  
- **Email Notifications:** Automated emails for session scheduling and reminders.  
- **Resume Text Extractor:** Autofill resumes with text extraction tools.  
- **JWT Authentication:** Secure user login and session management.  

---

## 🚀 Installation and Setup  

1. **Clone the Repository:**  
   ```bash
   git clone https://github.com/your-username/margadarshak.git
   cd margadarshak
2. **Install Dependencies:**
   ```bash
   # Install frontend dependencies
   cd client
   npm install
    
   # Install backend dependencies
   cd ../server
   npm install
3. **Set Up Environment Variables:**
   Create a .env file in the server directory and configure the following:
   ```bash
   PORT=5000
   MONGO_URI=<Your MongoDB URI>
   JWT_SECRET=<Your JWT Secret>

   GOOGLE_API_KEY=<Your Google API Key>
   SESSION_SECRET=<Your Session Secret>
   GOOGLE_CLIENT_ID=<Your Google Client ID>
   GOOGLE_CLIENT_SECRET=<Your Google Client Secret>
4. **Run the Application:**
   ```bash
   # Run backend
   cd server
   npm start

   # Run frontend
   cd ../client
   npm start
5. **Access the Application:**
   Open your browser and navigate to http://localhost:3000.

## 🛠️ Key Functionalities
- **User Authentication:** Secure login for mentors and mentees using JWT.
- **Dynamic Dashboard:** Personalized dashboards for managing sessions and tracking progress.
- **Real-Time Updates:** Instant updates on bookings, notifications, and interactions.
- **Responsive Design:** Fully optimized for desktops, tablets, and mobile devices.
