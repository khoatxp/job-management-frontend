import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import {useState} from 'react';
function ResumeCard(props){
    
    const [isDesktop, setIsDesktop]=useState({ isDesktop: window.innerWidth > 800 });
    const resume = props.resume;

    const degrees = resume.schools ? resume.schools.map((school) => `Degree: ${school.degree ?? '??'}. Major: ${school.field ?? '??'}`) : [];
    const schools = resume.schools ? resume.schools.map((school) => `${school.org ?? '??'} from ${school.start ? school.start.month : '??'}/${school.start ? school.start.year : '??'} to ${school.end ? school.end.month : '??'}/${school.end ? school.end.year : '??'}`) : [];
    const links = resume.links ? resume.links.map((link) => link.url ?? '??').join(', ') : [];
    const data = [
    { info: 'Name', parsed: resume.names ? resume.names.join(', ') : [] },
    { info: 'Email', parsed: resume.emails ? resume.emails[0].value : [] },
    { info: 'Phone', parsed: resume.phones ? resume.phones[0].value : [] },
    { info: 'University', parsed: schools.join(', ') },
    { info: 'Degree', parsed: degrees.join(', ') },
    { info: 'Links', parsed: links },
    { info: 'Summary', parsed: resume.summary && resume.summary.experience ? resume.summary.experience : '??' },
    { info: 'Skills', parsed: resume.summary && resume.summary.skills ? resume.summary.skills : '??' },
    ];
    const positions = resume.positions ? resume.positions.map((position) => ({
    company: position.org ?? '??', position: position.title ?? '??', date: `${position.start ? position.start.month : '??'}/${position.start ? position.start.year : '??'} - ${position.end ? position.end.month : '??'}/${position.end ? position.end.year : '??'}`, summary: position.summary ?? '??',
    })) : [];
    const limitedPositions = resume.positions ? resume.positions.map((position) => ({
    company: `${position.org} -- 
        ${position.title} (${position.start ? position.start.month : '??'}/${position.start ? position.start.year : '??'} - ${position.end ? position.end.month : '??'}/${position.end ? position.end.year : '??'}` ?? '??',
    summary: position.summary ?? '??',
    })) : [];

    const summaryColumns = [
        {
          Header: 'Information',
          accessor: 'info',
          style: { whiteSpace: 'unset' },
          minWidth: 50,
        },
        {
          id: 'parsed',
          Header: 'Parsed',
          accessor: 'parsed',
          style: { whiteSpace: 'unset' },
        },
  
      ];
      const jobColumns = [
        {
          Header: 'Company',
          accessor: 'company',
          minWidth: 40,
          style: { whiteSpace: 'unset' },
        },
        {
          Header: 'Position',
          accessor: 'position',
          minWidth: 50,
          style: { whiteSpace: 'unset' },
        },
        {
          Header: 'Dates',
          accessor: 'date',
          minWidth: 25,
          style: { whiteSpace: 'unset' },
        },
        {
          Header: 'Summary',
          accessor: 'summary',
          style: { whiteSpace: 'unset' },
        },
  
      ];
      const limitedColumns = [
        {
          Header: 'Company',
          accessor: 'company',
          style: { whiteSpace: 'unset' },
          minWidth: 60,
          Footer: true && <div />,
        },
        {
          Header: 'Summary',
          accessor: 'summary',
          style: { whiteSpace: 'unset' },
          Footer: true && <div />,
        },
  
      ];
      return (
        <div>
          {resume && data && positions
                // Render a table summarizing our accounts here probably
                && (
                <div>
                  <p>Resume Summary:</p>
                  <ReactTable
                    data={data}
                    columns={summaryColumns}
                    defaultPageSize={data.length}
                    showPaginationBottom={false}
                    showPageSizeOptions={false}
                  />
                  <br />
                  <p>Work Experience</p>
                  <ReactTable
                    data={isDesktop ? positions : limitedPositions}
                    columns={isDesktop ? jobColumns : limitedColumns}
                    defaultPageSize={positions.length}
                    showPaginationBottom={false}
                    showPageSizeOptions={false}
                  />
                </div>
                )}
        </div>
      );
}

  
  export default ResumeCard;