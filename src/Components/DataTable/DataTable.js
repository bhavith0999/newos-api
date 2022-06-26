import React, { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column';

const NeoDataTable = ({ data, changePage, totalRecords, first }) => {

    const [lazyParams, setLazyParams] = useState({
        sortField: null,
        sortOrder: null,
        first: 0
    });
    useEffect(() => {
        setLazyParams({...lazyParams,first})
    },[first])


    const onSort = (e) => {
        setLazyParams(e)
    }

    console.log(totalRecords)
    return (
        <div className='mt-4'>
            <h3>Data Table:</h3>
            <DataTable value={data} paginator responsiveLayout="scroll"
                emptyMessage="No data found."
                onSort={onSort}
                totalRecords={totalRecords}
                onPage={changePage}
                first={lazyParams.first}
                sortField={lazyParams.sortField} sortOrder={lazyParams.sortOrder}
                lazy
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={20}>
                <Column sortable field="name" header="Name" />
                <Column field="miss_distance" header="Closest Distance to Earth" sortable />
                <Column field="avgDiameter" header="Average Diameter" sortable />
                <Column field="is_potentially_hazardous_asteroid" header="POTENTIALLY HAZARDOUS" sortable />
            </DataTable>
        </div>
    )
}

export default NeoDataTable