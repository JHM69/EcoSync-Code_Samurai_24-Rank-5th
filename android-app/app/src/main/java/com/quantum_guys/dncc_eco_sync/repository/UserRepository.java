package com.quantum_guys.dncc_eco_sync.repository;


import static com.quantum_guys.dncc_eco_sync.ui.activities.MainActivity.userId;

import android.app.Application;
import android.os.AsyncTask;

import androidx.lifecycle.LiveData;

import com.google.firebase.auth.FirebaseAuth;

import com.quantum_guys.dncc_eco_sync.dao.DaoAccess;
import com.quantum_guys.dncc_eco_sync.db.QuizResultDatabase;
import com.quantum_guys.dncc_eco_sync.models.Users;

import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

public class UserRepository {
    private final Executor executor = Executors.newSingleThreadExecutor();
    private final DaoAccess resultDao;
    final QuizResultDatabase database;

    public UserRepository(Application application) {
        database = QuizResultDatabase.getInstance(application);
        resultDao = database.daoAccess();
    }

    public void insertUser(final Users user) {
        new InsertUserAsyncTask(resultDao).execute(user);
    }

    public Users getUser() {
        return resultDao.getTask(FirebaseAuth.getInstance().getUid());
    }

    public void updateUser(Users user) {
        resultDao.update(user);
    }


    public void updateUserImage(String image) {
        new UpdateImageAsyncTask(resultDao).execute(image);
    }

    public void updateXp(int x) {
        new UpdateXPAsyncTask(resultDao).execute(x);
    }

    public void updateScore(int x) {
        new UpdateScoreAsyncTask(resultDao).execute(x);
    }

    public void updateWin(int x) {
        new UpdateWinAsyncTask(resultDao).execute(x);
    }

    public void updateLose(int x) {
        new UpdateLoseAsyncTask(resultDao).execute(x);
    }

    public void updateDraw(int x) {
        new UpdateDrawAsyncTask(resultDao).execute(x);
    }


    //---------------

    public void setXp(int x) {
        new SetXPAsyncTask(resultDao).execute(x);
    }

    public void setScore(int x) {
        new SetScoreAsyncTask(resultDao).execute(x);
    }
    public void setReward(int x) {
        new SetRewardAsyncTask(resultDao).execute(x);
    }

    public void setWin(int x) {
        new SetWinAsyncTask(resultDao).execute(x);
    }

    public void setLose(int x) {
        new SetLoseAsyncTask(resultDao).execute(x);
    }

    public void setDraw(int x) {
        new SetDrawAsyncTask(resultDao).execute(x);
    }


    //--------


    public void deleteDb() {
        database.clearAllTables();
    }

    public LiveData<Users> getLiveUser() {
        return resultDao.getLiveTask(FirebaseAuth.getInstance().getUid());
    }

    public Users getStaticUser() {
        return resultDao.getStaticUser(FirebaseAuth.getInstance().getUid());
    }

    public Users getStaticChat(String s) {
        return resultDao.getStaticUser(s);
    }

    public void deleteUser(String id) {
        resultDao.deleteUser(id);
    }

    private static class UpdateScoreAsyncTask extends AsyncTask<Integer, Void, Void> {
        private final DaoAccess resultDao;

        private UpdateScoreAsyncTask(DaoAccess resultDao) {
            this.resultDao = resultDao;
        }

        @Override
        protected Void doInBackground(Integer... integers) {
            resultDao.updateScore(integers[0], userId);
            return null;
        }
    }

    private static class UpdateLoseAsyncTask extends AsyncTask<Integer, Void, Void> {
        private final DaoAccess resultDao;

        private UpdateLoseAsyncTask(DaoAccess resultDao) {
            this.resultDao = resultDao;
        }

        @Override
        protected Void doInBackground(Integer... integers) {
            resultDao.updateLose(integers[0], userId);
            return null;
        }
    }


    private static class UpdateDrawAsyncTask extends AsyncTask<Integer, Void, Void> {
        private final DaoAccess resultDao;

        private UpdateDrawAsyncTask(DaoAccess resultDao) {
            this.resultDao = resultDao;
        }

        @Override
        protected Void doInBackground(Integer... integers) {
            resultDao.updateDraw(integers[0], userId);
            return null;
        }
    }


    private static class UpdateWinAsyncTask extends AsyncTask<Integer, Void, Void> {
        private final DaoAccess resultDao;

        private UpdateWinAsyncTask(DaoAccess resultDao) {
            this.resultDao = resultDao;
        }

        @Override
        protected Void doInBackground(Integer... integers) {
            resultDao.updateWin(integers[0], userId);
            return null;
        }
    }


    private static class UpdateXPAsyncTask extends AsyncTask<Integer, Void, Void> {
        private final DaoAccess resultDao;

        private UpdateXPAsyncTask(DaoAccess resultDao) {
            this.resultDao = resultDao;
        }

        @Override
        protected Void doInBackground(Integer... integers) {
            resultDao.updateXp(integers[0], userId);
            return null;
        }
    }

    private static class InsertUserAsyncTask extends AsyncTask<Users, Void, Void> {
        private final DaoAccess resultDao;

        private InsertUserAsyncTask(DaoAccess resultDao) {
            this.resultDao = resultDao;
        }

        @Override
        protected Void doInBackground(Users... results) {
            resultDao.insert(results[0]);
            return null;
        }
    }




    private static class UpdateImageAsyncTask extends AsyncTask<String, Void, Void> {
        private final DaoAccess resultDao;

        private UpdateImageAsyncTask(DaoAccess resultDao) {
            this.resultDao = resultDao;
        }

        @Override
        protected Void doInBackground(String... integers) {
            resultDao.updateUserImage(integers[0], userId);
            return null;
        }
    }


    private static class SetRewardAsyncTask extends AsyncTask<Integer, Void, Void> {
        private final DaoAccess resultDao;

        private SetRewardAsyncTask(DaoAccess resultDao) {
            this.resultDao = resultDao;
        }

        @Override
        protected Void doInBackground(Integer... integers) {
            resultDao.setReward(integers[0], userId);
            return null;
        }
    }


    private static class SetScoreAsyncTask extends AsyncTask<Integer, Void, Void> {
        private final DaoAccess resultDao;

        private SetScoreAsyncTask(DaoAccess resultDao) {
            this.resultDao = resultDao;
        }

        @Override
        protected Void doInBackground(Integer... integers) {
            resultDao.setScore(integers[0], userId);
            return null;
        }
    }

    private static class SetLoseAsyncTask extends AsyncTask<Integer, Void, Void> {
        private final DaoAccess resultDao;

        private SetLoseAsyncTask(DaoAccess resultDao) {
            this.resultDao = resultDao;
        }

        @Override
        protected Void doInBackground(Integer... integers) {
            resultDao.setLose(integers[0], userId);
            return null;
        }
    }


    private static class SetDrawAsyncTask extends AsyncTask<Integer, Void, Void> {
        private final DaoAccess resultDao;

        private SetDrawAsyncTask(DaoAccess resultDao) {
            this.resultDao = resultDao;
        }

        @Override
        protected Void doInBackground(Integer... integers) {
            resultDao.setDraw(integers[0], userId);
            return null;
        }
    }


    private static class SetWinAsyncTask extends AsyncTask<Integer, Void, Void> {
        private final DaoAccess resultDao;

        private SetWinAsyncTask(DaoAccess resultDao) {
            this.resultDao = resultDao;
        }

        @Override
        protected Void doInBackground(Integer... integers) {
            resultDao.setWin(integers[0], userId);
            return null;
        }
    }


    private static class SetXPAsyncTask extends AsyncTask<Integer, Void, Void> {
        private final DaoAccess resultDao;

        private SetXPAsyncTask(DaoAccess resultDao) {
            this.resultDao = resultDao;
        }

        @Override
        protected Void doInBackground(Integer... integers) {
            resultDao.setXp(integers[0], userId);
            return null;
        }
    }



}
