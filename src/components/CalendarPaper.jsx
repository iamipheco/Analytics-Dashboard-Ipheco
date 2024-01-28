import React, { useState, useRef, useEffect } from "react";
import { CalendarComponent } from "@syncfusion/ej2-react-calendars";
import { Calendar as CalendarIcon } from "iconsax-react";

const CalendarPaper = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const calendarRef = useRef(null);

  const handleCalendarClick = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const handleDateChange = (args) => {
    setSelectedDate(args.value);
    setIsCalendarOpen(false); // Close the calendar when date is selected
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [calendarRef]);

  return (
    <div className="relative p-3 flex justify-center items-center gap-1 font-light text-[10px] dark:text-white">
      <div
        ref={calendarRef}
        className={`p-2 rounded-full transition-all duration-300 ease-in-out ${ 
          isHovered
            ? "bg-[#34CAA5] border-none p-2 "
            : "hover:bg-gray-200 hover:border-gray-300"
        } cursor-pointer`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCalendarClick}
      >
        <CalendarIcon
          size="22"
          color={isHovered ? "#fff" : "#697689"}
          variant="Broken"
          className="w-[22px] sm:w-[18px] md:w-[24px] lg:w-[28px] h-[22px] sm:h-[18px] md:h-[24px] lg:h-[28px] "
        />
      </div>
      <p
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "12px",
          fontWeight: 500,
          color: "#26282C",
        }}
        className="block sm:max-xl:hidden"
      >
        {selectedDate.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </p>
      {isCalendarOpen && (
        <div className="absolute top-16 border rounded shadow">
          <CalendarComponent
            value={selectedDate}
            onChange={handleDateChange}
            // You can add additional properties here as per your requirements
          />
        </div>
      )}
    </div>
  );
};

export default CalendarPaper;
