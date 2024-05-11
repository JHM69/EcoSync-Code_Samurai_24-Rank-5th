import React from 'react' 
import MonitoringItem from './MonitoringItem'
const MonitorItemEntries = ({ monitorEntries  }) => {
  return (
    <div className="block max-h-[75vh] overflow-y-auto rounded-lg border p-2 desktop:max-h-[80vh]">
      {monitorEntries?.length ? (
        monitorEntries?.map((i) => <MonitoringItem key={i.id} {...i} />)
      ) : (
        <div className="h-[100px] w-full text-center font-bold text-gray-300">
          Add some employee entries of contractor
        </div>
      )}
    </div>
  )
}

export default MonitorItemEntries
