import { select, selectAll, find, addClass, removeClass } from './utils/dom.js'
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
      windowHeight: windowRect.height
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

  init() {
    this.addInView()
  }
}
