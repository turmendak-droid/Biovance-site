 import React from 'react'
import ScrollExpandMedia from '../components/ui/scroll-expansion-hero'

const Hero = () => {
  return (
    <div className="mt-16 md:mt-20" style={{marginTop: '-130px',
      zIndex: '20'
    }}>
      <ScrollExpandMedia
        mediaType="video"
        mediaSrc="/assets/178809-860734631.mp4"
        posterSrc="/assets/41308.jpg"
        bgImageSrc="/assets/myanmar_tm5_2004349_lrg.jpg"
        title="INNOVATIVE SCIENCE FOR WILDLIFE CONSERVATION"
        date="Driving research and global scientific collaboration"
        scrollToExpand="Scroll to Explore"
      >
    </ScrollExpandMedia>
    </div>
  )
}

export default Hero;
