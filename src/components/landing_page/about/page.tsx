import React from 'react';

const About = () => {
    return (
        <div className='flex flex-row w-full pb-48'>
            <div className='w-5/12 flex items-center justify-center'>
                <img src="img/doctor.svg" alt="Doctor" />
            </div>
            <div className='w-7/12 flex items-center justify-center'>
                <div className=' mr-24'>
                    <p className="text-6xl text-[var(--color-p-300)] font-semibold mb-8">
                        Apa itu Healio.ai
                    </p>
                    <p className='text-2xl text-justify'>
                        Healio.ai adalah platform digital berbasis kecerdasan buatan (AI) yang dirancang untuk membantu masyarakat Indonesia dalam merencanakan, melacak, dan membiayai kebutuhan kesehatan secara lebih cerdas, transparan, dan inklusif.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default About;