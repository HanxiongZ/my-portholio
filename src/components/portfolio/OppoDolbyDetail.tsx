import { Artwork } from './OppoDolbyArtwork';
import './oppo-dolby-detail.css';
import { OppoDolbyImprovements } from './OppoDolbyImprovements';

const asset = (name: string) => `/images/oppo-dolby-detail/${name}`;


function LayoutStudy() {
  return <Artwork width={660} height={412} className="oa-dolby-wireframe">
    <div className="oa-dolby-wire-phone">
      <div className="oa-dolby-wire-toggle"><img src={asset('d7653.svg')} alt=""/></div>
      <div className="oa-dolby-wire-option"><img src={asset('b0bac.svg')} alt=""/></div>
      <div className="oa-dolby-wire-option oa-dolby-wire-option--selected"><img src={asset('9b5d0.svg')} alt=""/></div>
      <div className="oa-dolby-wire-grid">{[1,2,3,4].map(i=><div key={i}/>)}</div>
    </div>
    <div className="oa-dolby-wire-alternatives">
      <div className="oa-dolby-wire-list">{[1,2,3,4].map(i=><div key={i}>Profile {i}</div>)}</div>
      <div className="oa-dolby-wire-cards">{[1,2,3].map(i=><div key={i}>Profile {i}</div>)}<div/></div>
    </div>
    <div className="oa-dolby-wire-label oa-dolby-wire-label--list"><span>List view</span><strong>Limited space for visual expressions</strong></div>
    <div className="oa-dolby-wire-label oa-dolby-wire-label--grid"><span>2x2 Grid view</span><strong>Can show max 6 profiles with visual</strong></div>
    <div className="oa-dolby-wire-label oa-dolby-wire-label--cards"><span>Stacked view</span><strong>Larger previews but requires scrolling</strong></div>
  </Artwork>;
}

function CardSpecification() {
  return <Artwork width={660} height={218} className="oa-dolby-card-spec">
    <div className="oa-dolby-spec-selected">
      <span className="oa-spec-button-type">Botton/S<br/>Medium</span>
      <span className="oa-spec-theme">Theme Pressed</span>
      <span className="oa-spec-state">State Color</span>
      <span className="oa-spec-ag">Ag</span>
      <div className="oa-spec-profile"><div>Profile Name</div><p>Description of each sound profile</p></div>
      <img className="oa-spec-state-line" src={asset('1cb49.svg')} alt=""/>
      <img className="oa-spec-selected-text-line" src={asset('44159.svg')} alt=""/>
    </div>
    <div className="oa-dolby-spec-default">
      <span className="oa-spec-radius-type">corner radius 12px</span>
      <span className="oa-spec-body-type">Body/XS<br/>Regular</span>
      <span className="oa-spec-ag">Ag</span>
      <div className="oa-spec-profile"><div>Profile Name</div><p>Description of each sound profile</p></div>
      <img className="oa-spec-radius-circle" src={asset('c92ef.svg')} alt=""/>
      <img className="oa-spec-radius-vertical" src={asset('755a4.svg')} alt=""/>
      <img className="oa-spec-radius-horizontal" src={asset('8faa0.svg')} alt=""/>
      <img className="oa-spec-default-text-line" src={asset('c429e.svg')} alt=""/>
    </div>
  </Artwork>;
}

export function OppoDolbyDetail() {
  return <section id="oa-dolby" className="oa-dolby-detail" data-node-id="3411:7821">
    <div className="oa-dolby-detail-row oa-dolby-detail-row--product">
      <Artwork width={660} height={518} className="oa-dolby-product-art">
        <img className="oa-dolby-screen-image" src={asset('4575a.png')} alt="Dolby Atmos sound profile settings"/>
        <img className="oa-dolby-device-image" src={asset('45009.png')} alt=""/>
        <img className="oa-dolby-earbuds-image" src={asset('18534.png')} alt="OPPO earbuds"/>
      </Artwork>
      <div className="oa-dolby-detail-copy">
        <h2>Dolby Atmos</h2>
        <p className="oa-dolby-detail-lead">A consist experience to configure the Dolby sound profiles.</p>
        <p>I worked on adapting Dolby Atmos settings to different device capabilities and aligning with card-style layout. Fix and improve the fundamental user experience.</p>
        <p className="oa-dolby-detail-keywords">Feature Extension / UI Refresh / UX Consistency</p>
      </div>
    </div>
    <div className="oa-dolby-detail-row oa-dolby-detail-row--study" data-node-id="3416:8248">
      <LayoutStudy />
      <div className="oa-dolby-study-copy">
        <p className="oa-dolby-study-label">Wireframe line-up</p>
        <h3>Balanced layout in one view</h3>
        <p>To line up with the card-styled layout, a 2×2 card view is adopted for visual balance and ux efficiency, allowing users to compare and select all sound modes within a single view, without scrolling.</p>

      </div>
    </div>
    <div className="oa-dolby-detail-row oa-dolby-detail-row--component" data-node-id="3417:3606">
      <CardSpecification />
      <div className="oa-dolby-study-copy"><p>The chosen layout called for a dedicated card component, consistent with the design system.</p><p>A shared structure brings together the visual preview, profile name and description, with a distinct selected state.</p></div>
    </div>
    <OppoDolbyImprovements />
  </section>;
}
