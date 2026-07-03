import React from "react"
//ScoreCircle component takes a 'score' (default 75 ) and renders a circular progress indicator
const ScoreCircle = ({ score = 75 } : { score = number}) => {
    //Radius of the circle
    const radius = 50;
    //Stroke width of the circle
    const stroke = 8;
    //Adjusted radius to accounted for stroke width ( so, circle fits inside the viewbox)
    const normalizedRadius = radius - radius - stroke/2;
    //Circumference of the circle (used of stroke Dash Array)
    const circumference = 2 * Math.PI * normalizedRadius;
    // Progress as a value  between 0 and 1
    const progress = score / 100;
    //Strock Offset for the Progress Circle ( and how much of the circle is empty)
    const strokeDashoffset = circumference * (1 - progress)
    return (
        // Container for thr circle with fixed width and height
        <div className="relative w-[100px] h-[100px]">
            <svg
                height="100%"
                width="100%"
                viweBox="0 0 100 100"
                className="transform-rotate-90"> //Rotate to start the progress from top
                {/* Background Circle (fully grey Circle)*/}

                <circle
                    cx ="50"// x-coordinate of circle center
                    cy="50" // y-coordinate of circle center
                r = {normalizedRadius}// radius of the circle
                stroke="#e5e7eb" // light grey color for background
                    strokeWidth={stroke} // width of the stroke
                    fill="transparent" // no fill color
                    { /* define gradient from the progress circle */ }
                <defs>
                </defs>


        </div>
    )

}
