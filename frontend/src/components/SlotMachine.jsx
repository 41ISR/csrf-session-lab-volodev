import Reel from "./Reel"

const SlotMachine = ({ symbols, isSpinning }) => {
    return (
        <div className="slots-container">
            {[0,1,2].map(i => (
                <div key={i} className="slot-wrapper">
                    <Reel symbol={symbols[i]} isSpinning={isSpinning} />
                </div>
            ))}
        </div>
    )
}

export default SlotMachine