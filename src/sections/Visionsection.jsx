import React, { useState } from 'react'

const Visionsection = () => {
  const [activeVision, setActiveVision] = useState(null)

  const visions = [
    {
      id: 1,
      title: "AI That Learns from Nature",
      preview: "Intelligence modeled after life itself.",
      expanded: "Nature has been refining intelligence for billions of years. At Zytherion Biovance, we study these organic systems to build AI that learns like nature — not against it. Our models adapt, self-correct, and evolve, helping researchers discover natural patterns faster than ever before. The goal isn't to simulate nature — it's to collaborate with it.",
      smallImage: "/assets/41308.jpg",
      heroImage: "/assets/41308.jpg"
    },
    {
      id: 2,
      title: "The Ocean Thinks in Data",
      preview: "Marine AI that listens to the planet's pulse.",
      expanded: "Beneath the waves lies a data ecosystem that holds answers to sustainability. Our Marine AI systems analyze millions of points — from coral health to ocean currents — to help predict changes before they happen. By transforming oceanic chaos into clarity, we're giving marine scientists new tools to protect life below the surface.",
      smallImage: "/assets/vibrant-coral-reef-ecosystem.webp",
      heroImage: "/assets/vibrant-coral-reef-ecosystem.webp"
    },
    {
      id: 3,
      title: "Awakening Earth's Code",
      preview: "Understanding the algorithms of climate and life.",
      expanded: "Climate systems are not random — they follow hidden codes that connect every forest, ocean, and cloud. Our Climate AI deciphers these codes, revealing patterns that help predict climate events and support real-world restoration. We call it Earth's Code — the intelligence that sustains all life.",
      smallImage: "/assets/27Storms.webp",
      heroImage: "/assets/27Storms.webp"
    },
    {
      id: 4,
      title: "Wildlife Intelligence",
      preview: "Tracking nature's rhythm to protect its balance.",
      expanded: "Every species tells a story of survival and adaptation. Wildlife AI maps those stories — from migration paths to behavioral data — giving conservationists the insight they need to protect biodiversity. The result: an evolving digital ecosystem that listens to life itself.",
      smallImage: "/assets/myanmar_tm5_2004349_lrg.jpg",
      heroImage: "/assets/myanmar_tm5_2004349_lrg.jpg"
    },
    {
      id: 5,
      title: "Building Climate Resilience",
      preview: "AI that helps ecosystems adapt and thrive.",
      expanded: "Nature has always found a way to adapt. Our Resilience AI studies how ecosystems recover after stress, enabling governments, NGOs, and scientists to plan smarter restoration strategies. Because protecting tomorrow begins with understanding how the Earth heals today.",
      smallImage: "/assets/080824_Reforestation-projects-around-the-world-success-stories-and-lessons-learnedVisual-2.webp",
      heroImage: "/assets/080824_Reforestation-projects-around-the-world-success-stories-and-lessons-learnedVisual-2.webp"
    },
    {
      id: 6,
      title: "The Future Ecosystem",
      preview: "A world where AI and nature evolve together.",
      expanded: "Zytherion Biovance envisions an interconnected network of intelligent systems — Wildlife AI, Marine AI, Climate AI, and more — that continuously learn from one another. Together, they form the foundation of a global AI ecosystem, designed not to control nature, but to amplify its resilience. The future of Earth is not artificial — it's intelligent.",
      smallImage: "/assets/rs=w_1200,cg_true (1).webp",
      heroImage: "/assets/rs=w_1200,cg_true (1).webp"
    }
  ]

  return (
    <div className='min-h-screen bg-[#0e4903] flex items-center justify-center py-20 px-6 md:px-10'>
      <div className='w-full md:w-4/5 rounded-3xl bg-gradient-to-br from-[#faf8f2] to-[#f7f5ef] shadow-[0_30px_80px_rgba(0,0,0,0.22)] mt-28 p-8 md:p-12'>
        <div className='text-center mb-12'>
          <h2 className='text-4xl md:text-5xl font-light mb-4 space-grotesk bg-gradient-to-r from-[#0a3b2e] to-[#1ca57a] bg-clip-text text-transparent'>Our Vision</h2>
          <p className='text-xl text-[#204f3b] space-grotesk'>Exploring Earth's Potential Through Intelligence</p>
        </div>

        {activeVision && (
          <div className='bg-white/25 backdrop-blur-md border border-white/30 rounded-3xl p-10 shadow-[0_0_50px_rgba(14,73,3,0.1)] mb-12'>
            <div className='flex flex-col md:flex-row gap-8 items-center'>
              <div className='md:w-1/2'>
                <img src={activeVision.heroImage} alt={activeVision.title} className='w-full h-auto rounded-xl shadow-lg'/>
              </div>
              <div className='md:w-1/2'>
                <h3 className='text-3xl md:text-4xl font-semibold text-[#113b33] mb-6 space-grotesk'>{activeVision.title}</h3>
                <p className='text-[#335c47] text-lg leading-relaxed'>{activeVision.expanded}</p>
              </div>
            </div>
          </div>
        )}

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {visions.map((vision) => (
            <div
              key={vision.id}
              onClick={() => setActiveVision(activeVision?.id === vision.id ? null : vision)}
              className={`bg-[#0e4903]/10 backdrop-blur-md border rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,255,100,0.15)] ${
                activeVision?.id === vision.id
                  ? 'border-[#0e4903] shadow-[0_0_40px_rgba(14,73,3,0.2)]'
                  : 'border-[#0e4903]/10'
              }`}
            >
              <img src={vision.smallImage} alt={vision.title} className='w-16 h-16 mx-auto mb-4 rounded-lg object-cover'/>
              <h4 className='text-xl font-semibold text-[#174c3c] mb-2 space-grotesk text-center'>{vision.title}</h4>
              <p className='text-[#466959] text-center'>{vision.preview}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Visionsection;