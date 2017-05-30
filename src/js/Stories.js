import { select, selectAll, find, addClass, removeClass } from './utils/dom.js'
import { debounce } from 'lodash'
import inView from 'in-view'

export default class Stories {
  constructor() {
    const $container = select('[data-in-view]')
    const stories = selectAll('[data-story]')
    const images = selectAll('[data-image]')
    const windowRect = this.getWindowRect()

    this.props = {
      $container,
      stories,
      images
    }

    this.state = {
      windowWidth: windowRect.width,
      windowHeight: windowRect.height,
      inViewSet: false
    }

    this.init()
  }

  getWindowRect() {
    const w = window
    const d = document
    const e = d.documentElement
    const g = d.getElementsByTagName('body')[0]
    const width = w.innerWidth||e.clientWidth||g.clientWidth
    const height = w.innerHeight||e.clientHeight||g.clientHeight

    return {
      width,
      height
    }
  }

  setPortraitImage($image) {
    const { windowHeight } = this.state
    const { clientHeight } = $image

    $image.style.left = '0%'
    $image.style.marginLeft = '0'

    if(clientHeight > windowHeight) {
      $image.style.top = '50%'
      $image.style.marginTop = `-${clientHeight/2}px`
    } else {
      $image.style.top = '0'
    }
  }

  setLandscapeImage($image) {
    const { windowWidth } = this.state
    const { clientWidth } = $image

    $image.style.top = '0'
    $image.style.marginTop = '0'

    if(clientWidth > windowWidth) {
      $image.style.left = '50%'
      $image.style.marginLeft = `-${clientWidth/2}px`
    } else {
      $image.style.left = '0'
    }
  }

  setImageSizes() {
    const { windowWidth, windowHeight } = this.state
    const windowAspectRatio = windowWidth/windowHeight
    const { images } = this.props

    images.forEach($image => {
      const { clientWidth, clientHeight } = $image
      const imageAspectRatio =  clientWidth/clientHeight

      if(windowAspectRatio >= imageAspectRatio) {
        $image.style.width = '100%'
        $image.style.height = 'auto'
        this.setPortraitImage($image)
      } else {
        $image.style.height = '100%'
        $image.style.width = 'auto'
        this.setLandscapeImage($image)
      }
    })
  }

  stick($sticky) {
    $sticky.style.position = 'fixed'
    $sticky.style.top = '0'
    $sticky.style.left = '0'
  }

  stickToBottom($sticky) {
    $sticky.style.position = 'absolute'
    $sticky.style.top = 'initial'
    $sticky.style.bottom = '0'
    $sticky.style.left = '0'
  }

  unstick($sticky) {
    $sticky.style.position = 'absolute'
    $sticky.style.top = '0'
    $sticky.style.bottom = 'initial'
    $sticky.style.left = '0'
  }

  handleScroll(e) {
    const { stories } = this.props
    const { windowHeight } = this.state
    stories.forEach($story => {
      const rect = $story.getBoundingClientRect()
      const $sticky = find($story, '[data-sticky]')[0]
      if(rect.bottom <= windowHeight) {
        this.stickToBottom($sticky)
      } else if(rect.top <= 0) {
        this.stick($sticky)
      } else {
        this.unstick($sticky)
      }
    })
  }

  addInView() {
    const { $container } = this.props
    const scrollFunction = this.handleScroll.bind(this)
    inView('[data-in-view]')
      .on('enter', el => {
        window.addEventListener('scroll', scrollFunction)
      })
      .on('exit', el => {
        window.removeEventListener('scroll', scrollFunction)
      })
  }

  onResize() {
    window.addEventListener('resize', debounce(() => {
      if (window.innerWidth > 640) {

        if(!this.state.inViewSet) {
          this.addInView()
          this.state.inViewSet = true
        }

        const windowRect = this.getWindowRect()
        this.state.windowWidth = windowRect.width
        this.state.windowHeight = windowRect.height
        this.setImageSizes()
      }
    }, 300))
  }

  eventListeners() {
    this.onResize()
  }

  init() {
    if (window.innerWidth > 640) {

      if(!this.state.inViewSet) {
        this.addInView()
        this.state.inViewSet = true
      }

      this.setImageSizes()
    }
    this.eventListeners()
  }
}
