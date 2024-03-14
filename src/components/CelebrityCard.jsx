import PropTypes from 'prop-types';

function CelebrityCard(props) {
    const { celebrities } = props;
    const { onDelete } = props;

    return (
        <div className="container">
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-3 g-4">
                {celebrities.map(celebrity => (
                    <div className="col" key={celebrity.id}>
                        <div className="card h-100">
                            <div className="card-header">
                                <h4 className="card-title">{celebrity.name}</h4>
                            </div>
                            <div className="card-body">
                                <table className="table table-borderless m-0">
                                    <tbody>
                                        <tr>
                                            <td><strong>Életkor:</strong></td>
                                            <td>{celebrity.age}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Foglalkozás:</strong></td>
                                            <td>{celebrity.job}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Életben van-e:</strong></td>
                                            <td>{celebrity.alive ? 'Igen' : 'Nem'}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Aktivitás kezdete:</strong></td>
                                            <td>{celebrity.activeFrom}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="card-footer">
                                <button className="btn btn-primary me-2" onClick={() => props.onEdit(celebrity)}>Módosít</button>
                                <button className="btn btn-danger" onClick={() => onDelete(celebrity.id)}>Töröl</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

CelebrityCard.propTypes = {
    celebrities: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CelebrityCard;
