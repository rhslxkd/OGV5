import {useMemo, useState} from "react";


function Pagination({
                        page,
                        totalPages,
                        around = 5,
                        onPageChange
                    }) {
    const state = useMemo(() => {
        const current = Math.max(1, page || 1);
        const total = Math.max(1, totalPages || 1);
        const first = current === 1;
        const last = current === total;
        const startPage = Math.max(1, current - around);
        const endPage = Math.min(total, current + around);
        return { current, total, first, last, startPage, endPage };
    }, [page, totalPages, around]);

    const handleClick = (p) => {
        if (p < 1 || p > state.total || p === state.current) return;
        onPageChange?.(p);
    }

const PageBtn = ({ to, label, iconClass, aria }) => (
    <li className={`page-item ${to === false ? "disabled" : ""}`}>
        {to === false ? (
            <span className="page-link" aria-hidden="true">
{iconClass ? <i className={iconClass} /> : label}
</span>
        ) : (
            <button type="button"
                    className="page-link"
                    aria-label={aria}
                    onClick={() => handleClick(to)}>
                {iconClass ? <i className={iconClass} /> : label}
            </button>
        )}
    </li>
);

const pages = [];
    for (let i = state.startPage; i <= state.endPage; i++) {
        const isActive = i === state.current;
        pages.push(
            <li key={i} className={`page-item ${isActive ? "active" : ""}`}>
                {isActive ? (
                    <span className="page-link">{i}</span>
                ) : (
                    <button type="button"
                            className="page-link"
                            onClick={() => handleClick(i)}
                            aria-current={isActive ? "page" : undefined}>
                        {i}
                    </button>
                )}
            </li>
        )
    }

return (
    <nav aria-label="pagination">
        <ul className="pagination pagination-sm no-margin pull-right"
            style={{ gap: 2 }}>
            {/* First */}
            <PageBtn
                to={state.first ? false : 1}
                aria="First"
                iconClass="fa fa-angle-double-left" />
            {/* Prev */}
            <PageBtn
                to={state.first ? false : state.current - 1}
                aria="Previous"
                iconClass="fa fa-angle-left" />
            {pages}
            {/* Next */}
            <PageBtn
                to={state.last ? false : state.current + 1}
                aria="Next"
                iconClass="fa fa-angle-right" />
            {/* Last */}
            <PageBtn
                to={state.last ? false : state.total}
                aria="Last"
                iconClass="fa fa-angle-double-right" />
        </ul>
    </nav>
);
}

export default Pagination;