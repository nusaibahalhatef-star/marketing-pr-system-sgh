import React, { useState } from 'react';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import '../styles/ContentScheduler.css';

const ContentScheduler = ({ onSchedule }) => {
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [repeatType, setRepeatType] = useState('none');
  const [repeatDays, setRepeatDays] = useState([]);

  const handleDateChange = (e) => {
    setScheduleDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setScheduleTime(e.target.value);
  };

  const handleRepeatChange = (day) => {
    setRepeatDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleSchedule = () => {
    if (!scheduleDate || !scheduleTime) {
      alert('يرجى تحديد التاريخ والوقت');
      return;
    }

    const scheduleData = {
      date: scheduleDate,
      time: scheduleTime,
      repeatType,
      repeatDays: repeatType === 'weekly' ? repeatDays : []
    };

    onSchedule(scheduleData);
  };

  const days = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
  const daysEn = ['sat', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri'];

  return (
    <div className="content-scheduler">
      <h3>📅 جدولة النشر</h3>

      <div className="scheduler-section">
        <label>التاريخ:</label>
        <div className="input-group">
          <Calendar size={20} />
          <input 
            type="date" 
            value={scheduleDate}
            onChange={handleDateChange}
          />
        </div>
      </div>

      <div className="scheduler-section">
        <label>الوقت:</label>
        <div className="input-group">
          <Clock size={20} />
          <input 
            type="time" 
            value={scheduleTime}
            onChange={handleTimeChange}
          />
        </div>
      </div>

      <div className="scheduler-section">
        <label>التكرار:</label>
        <select value={repeatType} onChange={(e) => setRepeatType(e.target.value)}>
          <option value="none">بدون تكرار</option>
          <option value="daily">يومي</option>
          <option value="weekly">أسبوعي</option>
          <option value="monthly">شهري</option>
        </select>
      </div>

      {repeatType === 'weekly' && (
        <div className="scheduler-section">
          <label>أيام التكرار:</label>
          <div className="days-selector">
            {days.map((day, index) => (
              <label key={day} className="day-checkbox">
                <input 
                  type="checkbox"
                  checked={repeatDays.includes(daysEn[index])}
                  onChange={() => handleRepeatChange(daysEn[index])}
                />
                <span>{day}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="scheduler-info">
        <AlertCircle size={18} />
        <p>سيتم نشر المحتوى تلقائياً في الوقت المحدد</p>
      </div>

      <button className="btn-schedule" onClick={handleSchedule}>
        تأكيد الجدولة
      </button>
    </div>
  );
};

export default ContentScheduler;
