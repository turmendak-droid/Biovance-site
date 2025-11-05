import React from 'react'
import ScrollExpandMedia from '../components/ui/scroll-expansion-hero'

const Hero = () => {
  return (
    <div style={{marginTop: '-130px'}}>
      <ScrollExpandMedia
        mediaType="video"
        mediaSrc="/assets/From KlickPin CF Nature scene nel 2025.mp4"
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
