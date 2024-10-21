import React, { useState } from 'react';
import axios from 'axios';

const ScheduleMeeting = () => {

    // const [menteeEmail, setMenteeEmail] = useState('');
    // const [mentorEmail, setMentorEmail] = useState('');
    // const [subject, setSubject] = useState('');
    // const [startTime, setStartTime] = useState('');
    // const [endTime, setEndTime] = useState('');
    // const [isAuthenticated, setIsAuthenticated] = useState(false);
    // const [sessionData, setSessionData] = useState(null);

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     if (!isAuthenticated || !sessionData) {
    //         alert('Please authenticate with Google before scheduling a meeting.');
    //         return;
    //     }

    //     const meetingData = {
    //         menteeEmail,
    //         mentorEmail,
    //         startTime,
    //         endTime,
    //         subject
    //     };

    //     try {
    //         const response = await axios.post('http://localhost:5000/api/meetings/schedule', meetingData, {
    //             withCredentials: true,
    //         });
    //         alert(response.data.message);
    //     } catch (error) {
    //         console.error('Error scheduling meeting:', error);
    //         alert('Failed to schedule meeting. Please check the console for more details.');
    //     }
    // };

    // const handleAuth = async () => {
    //     window.open('http://localhost:5000/api/meetings/auth', '_blank');
    //     const checkSession = setInterval(async () => {
    //         try {
    //             const sessionResponse = await axios.get('http://localhost:5000/api/meetings/session');
    //             if (sessionResponse.status === 200) {
    //                 clearInterval(checkSession); // Stop polling
    //                 setSessionData(sessionResponse.data.session);
    //                 setIsAuthenticated(true);
    //                 alert('Successfully authenticated');
    //             }
    //         } catch (error) {
    //             console.error('Session check failed:', error);
    //         }
    //     }, 1000);
    // };

    // return (
    //     <div>
    //         <button onClick={handleAuth} className='border border-black p-2 m-10 rounded-md'>Authenticate with Google</button>
    //         <form onSubmit={handleSubmit} className='m-2'>
    //             <div className="form-group">
    //                 <label className="block mb-1 text-sm">Enter Mentee Email</label>
    //                 <input 
    //                     className='border-black p-2 m-2 rounded-md'
    //                     type="email" 
    //                     value={menteeEmail} 
    //                     onChange={(e) => setMenteeEmail(e.target.value)} 
    //                     placeholder="Mentee Email" 
    //                     required 
    //                 />
    //             </div>
    //             <div className="form-group">
    //                 <label className="block mb-1 text-sm">Enter Mentor Email</label>
    //                 <input 
    //                     className='border-black p-2 m-2 rounded-md'
    //                     type="email" 
    //                     value={mentorEmail} 
    //                     onChange={(e) => setMentorEmail(e.target.value)} 
    //                     placeholder="Mentor Email" 
    //                     required 
    //                 />
    //             </div>
    //             <div className="form-group">
    //                 <label className="block mb-1 text-sm">Enter Subject of Meet</label>
    //                 <input 
    //                     className='border-black p-2 m-2 rounded-md'
    //                     type="text" 
    //                     value={subject} 
    //                     onChange={(e) => setSubject(e.target.value)} 
    //                     placeholder="Meeting Subject" 
    //                     required 
    //                 />
    //             </div>
    //             <div className="form-group">
    //                 <label className="block mb-1 text-sm">Set Start Date and Time</label>
    //                 <input 
    //                     className='border-black p-2 m-2 rounded-md'
    //                     type="datetime-local" 
    //                     value={startTime} 
    //                     onChange={(e) => setStartTime(e.target.value)} 
    //                     required 
    //                 />
    //             </div>
    //             <div className="form-group">
    //                 <label className="block mb-1 text-sm">Set End Date and Time</label>
    //                 <input 
    //                     className='border-black p-2 m-2 rounded-md'
    //                     type="datetime-local" 
    //                     value={endTime} 
    //                     onChange={(e) => setEndTime(e.target.value)} 
    //                     required 
    //                 />
    //             </div>
                
    //             <button type="submit" className='border border-green-400 bg-white font-black p-2 rounded-md'>Schedule Meeting</button>
    //         </form>
    //     </div>
    // );
    const [emails, setEmails] = useState("");
    const [startDateTime, setStartDateTime] = useState("");
    const [endDateTime, setEndDateTime] = useState("");
    const [description, setDescription] = useState("");
    const [response, setResponse] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const event = {
        description: description,
        start: { dateTime: new Date(startDateTime).toISOString() },
        end: { dateTime: new Date(endDateTime).toISOString() },
        attendees: emails.split(",").map((email) => ({ email: email.trim() })),
        };

        try {
        const res = await axios.post("http://localhost:5000/create-event", event);
        setResponse(res.data.message);
        } catch (error) {
        setResponse("Error: " + error.message);
        }
    };

    return (
        <div>
        <h1>Create Google Calendar Event</h1>
        <form onSubmit={handleSubmit}>
            <div>
            <label>Emails (comma-separated): </label>
            <input
                type="text"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                required
            />
            </div>

            <div>
            <label>Start Date & Time: </label>
            <input
                type="datetime-local"
                value={startDateTime}
                onChange={(e) => setStartDateTime(e.target.value)}
                required
            />
            </div>

            <div>
            <label>End Date & Time: </label>
            <input
                type="datetime-local"
                value={endDateTime}
                onChange={(e) => setEndDateTime(e.target.value)}
                required
            />
            </div>

            <div>
            <label>Description: </label>
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
            ></textarea>
            </div>

            <button type="submit">Create Event</button>
        </form>

        {response && <p>{response}</p>}
        </div>
    );
};

export default ScheduleMeeting;