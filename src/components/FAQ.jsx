import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "How far in advance should I book my bridal makeup?",
      answer: "We recommend booking your bridal makeup 3 to 6 months in advance, especially if your wedding falls during the peak wedding season (November to February). This ensures Kajal Shekhaliya is available for your dates."
    },
    {
      question: "Do you offer bridal makeup trials?",
      answer: "Yes, we offer paid bridal trials. If you decide to book your wedding package with us, a portion of the trial fee can be adjusted towards your final package price. Please contact us to schedule your trial."
    },
    {
      question: "What cosmetics brands do you use?",
      answer: "We use only premium, high-end, and international cosmetics brands to ensure safety and longevity. Our kit features products from MAC, Huda Beauty, Sephora, Estée Lauder, Anastasia Beverly Hills, and Fenty Beauty."
    },
    {
      question: "Are the courses at Radhe Beauty Academy certified?",
      answer: "Yes! All courses completed at Radhe Beauty Academy come with professional certification signed by Kajal Shekhaliya. Our Master Makeup course provides a Govt. Registered Academy Certificate, which is highly respected in the industry."
    },
    {
      question: "Can you travel to the wedding venue for makeup?",
      answer: "Yes, we travel to venues both within Surat and across Gujarat/outstation locations for bridal assignments. Outstation travel, lodging, and logistics are covered in our custom outstation packages."
    },
    {
      question: "Do I need to bring my own hair accessories for styling?",
      answer: "We supply standard pins and hair fillers. However, fresh flowers, designer hair accessories, or specific custom jewelry pieces should be supplied by the client. We will happily help set them during your hair styling."
    }
  ];

  const toggleAccordion = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <section className="py-20 bg-dark text-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center space-x-2 mb-3">
            <span className="w-10 h-[1.5px] bg-primary"></span>
            <span className="text-sm font-bold uppercase tracking-widest text-primary font-sans">Support</span>
            <span className="w-10 h-[1.5px] bg-primary"></span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-muted font-sans max-w-lg leading-relaxed">
            Have questions about bookings, academy classes, or services? Find quick answers below.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;
            return (
              <div
                key={index}
                className="border border-primary/25 rounded-[12px] overflow-hidden transition-all duration-300"
              >
                {/* Accordion Trigger */}
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between p-5 text-left bg-secondary hover:bg-secondary/80 transition-colors cursor-pointer select-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif font-bold text-white text-sm sm:text-base pr-4">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-primary shrink-0"
                  >
                    <FaChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                {/* Accordion Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="p-5 bg-dark border-t border-primary/10 font-sans text-sm sm:text-base text-muted leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
