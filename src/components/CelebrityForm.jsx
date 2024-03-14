    import PropTypes from "prop-types";
    import { useState, useEffect } from 'react';

    function CelebrityForm({ onSubmit, editingCelebrity, onUpdate, onResetEditingCelebrity}) {
        const [name, setName] = useState("");
        const [age, setAge] = useState("");
        const [job, setJob] = useState("");
        const [alive, setAlive] = useState(false);
        const [activeFrom, setActiveFrom] = useState("");
        const [errors, setErrors] = useState({});

        useEffect(() => {
        if (editingCelebrity) {
            setName(editingCelebrity.name);
            setAge(editingCelebrity.age.toString());
            setJob(editingCelebrity.job);
            setAlive(editingCelebrity.alive);
            setActiveFrom(editingCelebrity.activeFrom);
        } else {
            setName("");
            setAge("");
            setJob("");
            setAlive(false);
            setActiveFrom("");
        }
        }, [editingCelebrity]);

        const handleSubmit = async (event) => {
            event.preventDefault();

            let newErrors = {};
            if (!name.trim()) newErrors.name = ['A név megadása kötelező.'];
            if (!job.trim()) newErrors.job = ['A foglalkozás megadása kötelező.'];
            if (!age.trim()) newErrors.age = ['Az életkor megadása kötelező.'];
            if (!activeFrom.trim()) newErrors.activeFrom = ['Mióta aktív megadása kötelező.'];

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }

            const celebrity = {
                name,
                age: Number(age),
                job,
                alive,
                activeFrom,
            };
    
            let result = editingCelebrity
            ? await onUpdate(editingCelebrity.id, celebrity)
            : await onSubmit(celebrity);

    
            if (result && !result.success) {
                let parsedErrors;
                try {
                    parsedErrors = JSON.parse(result.message);
                } catch (e) {
                    console.error("A válasz nem JSON formátumú:", result.message);
                    parsedErrors = { message: "Ismeretlen hiba történt." };
                }
                setErrors(parsedErrors);         
            } 
            else {
                setName("");
                setAge("");
                setJob("");
                setAlive(false);
                setActiveFrom("");
                setErrors({});
                onResetEditingCelebrity();
                alert(editingCelebrity ? "Híresség sikeresen módosítva!" : "Híresség sikeresen felvéve!");
            }
        };
        

        return ( 
            <form onSubmit={handleSubmit}>
                <div className="container">
                    <div className="row g-3 m-2">

                        <div className="col-md-6">
                            <label htmlFor="name" className="form-label"><strong>Név:</strong></label>
                            <input
                            type="text"
                            className="form-control"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            />
                            {errors.name && <div className="text-danger">{errors.name.join(', ')}</div>}
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="job" className="form-label"><strong>Foglalkozás:</strong></label>
                            <input
                            type="text"
                            className="form-control"
                            id="job"
                            value={job}
                            onChange={(e) => setJob(e.target.value)}
                            />
                            {errors.job && <div className="text-danger">{errors.job.join(', ')}</div>}
                        </div>

                        <div className="col-md-3">
                            <label htmlFor="age" className="form-label"><strong>Életkor:</strong></label>
                            <input
                            type="number"
                            className="form-control"
                            id="age"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            />
                            {errors.age && <div className="text-danger">{errors.age.join(', ')}</div>}
                        </div>
                       
                        <div className="col-md-4">
                            <label className="form-check-label" htmlFor="alive"><strong>Életben van-e:</strong></label> <br/>
                            <input
                            type="checkbox"
                            className="form-check-input m-3"
                            id="alive"
                            checked={alive}
                            onChange={(e) => setAlive(e.target.checked)}
                            />
                        </div>

                        <div className="col-md-5">
                            <label htmlFor="activeFrom" className="form-label"><strong>Mióta aktív:</strong></label>
                            <input
                            type="date"
                            className="form-control"
                            id="activeFrom"
                            value={activeFrom}
                            onChange={(e) => setActiveFrom(e.target.value)}
                            />
                            {errors.activeFrom && <div className="text-danger">{errors.activeFrom.join(', ')}</div>}
                        </div>


                        <div className="col-12">
                            <button type="submit" className={`btn col-2 ${editingCelebrity ? 'btn-warning' : 'btn-success'}`}>
                                {editingCelebrity ? 'Módosítás' : 'Felvétel'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>


        );
    }

    CelebrityForm.prototype = {
        onSubmit: PropTypes.func.isRequired,
        editingCelebrity: PropTypes.func.isRequired,
        onUpdate: PropTypes.func.isRequired,
        onResetEditingCelebrity: PropTypes.func.isRequired
    }

    export default CelebrityForm;