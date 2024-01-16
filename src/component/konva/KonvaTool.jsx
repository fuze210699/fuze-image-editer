import React from 'react'
import { SelectIcon, ArrowUpIcon, LetterAIcon } from '../../assets/icons'

const KonvaTool = (props) => {

  return (
    <div className='konva-tool-wrap'>
      <div className={`icon-wrap ${props.activeTool === '' && 'active'}`} onClick={()=>props.handleActiveTool('')}>
        <img src={SelectIcon} alt='tool_icon' />
      </div>
      <div className={`icon-wrap ${props.activeTool === 'arrow' && 'active'}`} onClick={()=>props.handleActiveTool('arrow')}>
        <img src={ArrowUpIcon} alt='tool_icon' />
      </div>
      <div className={`icon-wrap ${props.activeTool === 'text' && 'active'}`} onClick={()=>props.handleActiveTool('text')}>
        <img src={LetterAIcon} alt='tool_icon' />
      </div>
    </div>
  )
}

export default KonvaTool
