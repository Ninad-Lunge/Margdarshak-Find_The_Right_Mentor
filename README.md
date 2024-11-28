# Margdarshak 
<img src="https://github.com/user-attachments/assets/2b7bc58d-10e7-43f2-a1d3-bf1efd9b1c00">

Margadarshak - Find the Right Mentor for youself.
# Margadarshak: A Smart Mentorship Platform  

## 📚 Overview  
Margadarshak is an advanced web-based mentorship platform that bridges the gap between aspiring professionals and experienced mentors. Designed to provide personalized career guidance, skill development, and collaborative learning opportunities, Margadarshak offers a seamless and efficient mentoring experience.  

With features like automated session booking, an ATS-optimized resume builder, real-time chat, and mentor-driven communities, Margadarshak is your one-stop solution for professional growth and networking.  

---

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
**User Authentication:** Secure login for mentors and mentees using JWT.
**Dynamic Dashboard:** Personalized dashboards for managing sessions and tracking progress.
**Real-Time Updates:** Instant updates on bookings, notifications, and interactions.
**Responsive Design:** Fully optimized for desktops, tablets, and mobile devices.
