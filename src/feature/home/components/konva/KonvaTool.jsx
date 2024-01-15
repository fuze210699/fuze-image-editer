import React from 'react'

const KonvaTool = (props) => {

  return (
    <div className='konva-tool-wrap'>
      <div className={`icon-wrap ${props.activeTool === '' && 'active'}`} onClick={()=>props.handleActiveTool('')}>
        <img src={require('../../../../assets/icons/select.png')} alt='tool_icon' />
      </div>
      <div className={`icon-wrap ${props.activeTool === 'arrow' && 'active'}`} onClick={()=>props.handleActiveTool('arrow')}>
        <img src={require('../../../../assets/icons/arrow_up.png')} alt='tool_icon' />
      </div>
      <div className={`icon-wrap ${props.activeTool === 'text' && 'active'}`} onClick={()=>props.handleActiveTool('text')}>
        <img src={require('../../../../assets/icons/letter_a.png')} alt='tool_icon' />
      </div>
    </div>
  )
}

export default KonvaTool
