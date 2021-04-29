import React, { Fragment, useCallback, memo } from 'react';
import { v4 as uuid } from 'uuid';
import { makeStyles } from '@material-ui/styles';

// Components
import ItemInput from './List/ItemInput';
import ItemsList from './List/ItemsList';

// Styles
import style from '../resumeDrawerStyles';

// Actions
import setResumeLanguages from '../../../store/actions/setResumeLanguages';

// Utils
import { varNameToString } from '../../../utils/utils';

// Hooks
import { useDispatch } from '../../../store/StoreProvider';

const useStyles = makeStyles((theme) => ({
    ...style,
}));

function Languages({ languages }) {
    const classes = useStyles();
    const dispatch = useDispatch();

    const setResumeLanguagesState = useCallback((newLanguages) => {
        dispatch(setResumeLanguages(newLanguages));
    }, [dispatch]);

    function toggleLanguages() {
        const currentState = languages?.enabled;
        setResumeLanguagesState({
            ...languages,
            enabled: !currentState,
        });
    }

    const toggleLanguage = useCallback((language) => () => {
        const newLanguages = { ...languages };
        newLanguages.value =
            newLanguages?.value.map((lang) => {
                if (JSON.stringify(lang?.value) === JSON.stringify(language?.value)) {
                    return {
                        ...lang,
                        enabled: !lang?.enabled,
                    };
                }
                return lang;
            });
        setResumeLanguagesState(newLanguages);
    }, [languages, setResumeLanguagesState]);

    const toggleLanguagesDetail = useCallback((language, propName) => () => {
        const newLanguages = { ...languages };
        newLanguages.value =
            newLanguages?.value.map((lang) => {
                if (JSON.stringify(lang?.value) === JSON.stringify(language?.value)) {
                    return {
                        ...lang,
                        value: {
                            ...lang?.value,
                            [propName]: {
                                ...lang?.value[propName],
                                enabled: !lang?.value[propName]?.enabled,
                            },
                        },
                    };
                }
                return lang;
            });
        setResumeLanguagesState(newLanguages);
    }, [languages, setResumeLanguagesState]);

    return (
        <div className={classes.resumeDrawerItem}>
            <ItemInput
                label="languages"
                onChange={toggleLanguages}
                checked={languages?.enabled}
            />
            {languages?.enabled && (
                <ul>
                    {languages?.value.map((lang) => {
                        const {
                            language,
                            fluency,
                        } = lang?.value || {};

                        return (
                            <Fragment key={uuid()}>
                                {lang && (
                                    <ItemsList
                                        label={language?.value}
                                        checked={lang?.enabled}
                                        onClick={toggleLanguage(lang)}
                                    />
                                )}
                                {lang?.enabled && (
                                    <ul>
                                        {language && (
                                            <ItemsList
                                                label={varNameToString({ language })}
                                                checked={language?.enabled}
                                                onClick={toggleLanguagesDetail(
                                                    lang,
                                                    varNameToString({ language })
                                                )}
                                            />
                                        )}
                                        {fluency && (
                                            <ItemsList
                                                label={varNameToString({ fluency })}
                                                checked={fluency?.enabled}
                                                onClick={toggleLanguagesDetail(
                                                    lang,
                                                    varNameToString({ fluency })
                                                )}
                                            />
                                        )}
                                    </ul>
                                )}
                            </Fragment>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export default memo(Languages);
