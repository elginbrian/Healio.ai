import FAQItem from '@/components/faq_item/page'
import React from 'react'

const FAQ = () => {
  return (
    <div className="px-6 md:px-24 pb-48">
      <p className="text-5xl text-[var(--color-p-300)] font-semibold mb-12 text-center">
        Fitur Healio.ai
      </p>
      <FAQItem />
      <FAQItem />
      <FAQItem />
      <FAQItem />
    </div>
  )
}

export default FAQ;
