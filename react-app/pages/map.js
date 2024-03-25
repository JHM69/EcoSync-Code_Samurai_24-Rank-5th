import React, { useState, useEffect } from 'react';
  
import { MapsComponent, LayersDirective, LayerDirective } from '@syncfusion/ej2-react-maps';
import { world_map } from './world_map';
 function DhakaNorthMap() {
    return (<MapsComponent id="maps">
            <LayersDirective>
                <LayerDirective shapeData={world_map}>
                </LayerDirective>
            </LayersDirective>
        </MapsComponent>);
}
export default DhakaNorthMap;
